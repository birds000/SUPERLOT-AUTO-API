const routes = require('express').Router();
const { API_V1 } = require('../../util/config');
const { LoginRefresh } = require('../scb/login');
const { Verification, Confirmation } = require('../scb/transfer');
const { TransactionAdd } = require('../../sql/transaction');
const { UserFindByUserid } = require('../../sql/user');
const { Withdraw } = require('../superlot/transfer');
const { GetMember } = require('../superlot/user');
 
// ถอน
routes.post(`${API_V1}/transfer/withdraw`, async (req, res) => {
    // req.body
    const body_userID = req.body.userID
    const body_amount = req.body.amount

    const error = { status: "fail", message: "ไม่สามารถทำรายการถอนเงินได้" }
    const error1001 = { status: "fail", message: "จำนวนเงินไม่เพียงพอ ไม่สามารถทำรายการถอนเงินได้" }

    if (body_userID && body_amount) { // ตรวจสอบ REQUES BODY
        // ค้นหาข้อมูลสมาชิก SELECT tb_user
        UserFindByUserid(body_userID, async function (err, result) {
            if (result) {
                var userid = result.user_id
                var username = result.user_username
                var bankNumber = result.user_banknumber.substr(-4) // str.substr(-4); ตัดข้อความเหลือ 4 ตัวสุดท้าย
                var remark = `โอนไป ${result.bank_abbrev_en} x${bankNumber} ${result.user_name}` // remark = "โอนไป BBL x6178 น.ส. ปราวีณา บุญมา"

                const res_getMember = await GetMember(username);
                if(res_getMember.balance){
                    if (parseFloat(body_amount) <= parseFloat(res_getMember.balance)) { //ตรวจสอบจำนวนเงิน <= จำนวนเงินในกระเป๋า tb_wallet
                        // SCB login
                        const res_login = await LoginRefresh();
                        if (res_login.status.code == "1000") {
                            const access_token = res_login.data.access_token;
    
                            //  SCB Verification สร้างบิล
                            const res_verification = await Verification(access_token, result.user_banknumber, result.bank_id, body_amount)
                            if (res_verification.status.code == "1000") { // verification สำเร็จ
                                const data_v = res_verification.data
    
                                // SCB confirmation ยืนยันการโอน
                                const res_confirmationn = await Confirmation(access_token, data_v.accountFromName, result.user_banknumber, result.bank_id, data_v.accountToName, body_amount, data_v.pccTraceNo, data_v.sequence, data_v.terminalNo, data_v.transactionToken, data_v.transferType)
                                if (res_confirmationn.status.code == "1000") { // confirmation สำเร็จ
                                    var data_c = res_confirmationn.data
    
                                    // เพิ่มประวัติในฐานข้อมูล INSERT VALUE tb_transaction
                                    TransactionAdd(data_c.transactionDateTime, body_amount, remark, "D", userid, async function (err, data) {
                                        if (data) {
    
                                            const res_withdraw = await Withdraw(username, body_amount)
                                            if (res_withdraw.amount) {
                                                console.log("ทำรายการถอนสำเร็จ")
                                                console.log({ result: res_withdraw, status: "success" })
                                                res.json({ result: res_withdraw, status: "success" })
                                            } else if(res_withdraw.message){ // error 
                                                console.log("supper lot : " + res_withdraw.message)
                                                res.json(error)
                                            } else {
                                                console.log("supper lot : error");
                                                res.json(error)
                                            }
    
                                        } else {  // error SQL  
                                            res.json({ result: err, status: "fail" })
                                        }
                                    });
    
                                } else { // SCB confirmation ไม่สำเร็จ
                                    console.log("err : SCB confirmation ไม่สำเร็จ")
                                    res.json(error)
                                }
    
                            } else { // SCB verification ไม่สำเร็จ
                                console.log("err : SCB verification ไม่สำเร็จ")
                                res.json(error)
                            }
    
                        } else { // SCB Login ไม่สำเร็จ
                            console.log("err : SCB Login ไม่สำเร็จ")
                            res.json(error)
                        }
    
                    } else { // error จำนวนเงินไม่เพียงพอ ไม่สามารถทำรายการถอนเงินได้
                        console.log("error จำนวนเงินไม่เพียงพอ ไม่สามารถทำรายการถอนเงินได้")
                        res.json(error1001)
                    }

                } else { // error supper lot get member
                    console.log("error suppuer lot get member")
                    res.json(error)
                }
                
            } else { // error SQL USER FIND BY USERID
                console.log("error SQL USER FIND BY USERID")
                res.json({ result: err, status: "fail" })
            }
        });

    } else { // error No BODY
        console.log("error No BODY")
        res.json(error)
    }
})


module.exports = routes;