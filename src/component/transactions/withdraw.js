const routes = require('express').Router();
const { API_V1 } = require('../../util/config');
const { LoginRefresh } = require('../scb/login');
const { Verification, Confirmation } = require('../scb/transfer');
const { TransactionAdd } = require('../../sql/transaction')
const { UserFindByUserid } = require('../../sql/user')
const { WalletWithdraw } = require('../../sql/wallet')

// ถอน
routes.post(`${API_V1}/transaction/withdraw`, async (req, res) => {
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
                var bankNumber = result.user_banknumber.substr(-4) // str.substr(-4); ตัดข้อความเหลือ 4 ตัวสุดท้าย
                var remark = `โอนไป ${result.bank_abbrev_en} x${bankNumber} ${result.user_name}` // remark = "โอนไป BBL x6178 น.ส. ปราวีณา บุญมา"

                if (parseFloat(body_amount) <= parseFloat(result.wallet_balance)) { //ตรวจสอบจำนวนเงิน <= จำนวนเงินในกระเป๋า tb_wallet
                    // SCB login
                    const access_token = JSON.parse(await LoginRefresh()).data.access_token;
                    if (access_token) {

                        //  SCB Verification สร้างบิล
                        const res_verification = JSON.parse(await Verification(access_token, result.user_banknumber, result.bank_id, body_amount))
                        if (res_verification.status.code == "1000") { // verification สำเร็จ
                            const data_v = res_verification.data

                            // SCB confirmation ยืนยันการโอน
                            const res_confirmationn = JSON.parse(await Confirmation(access_token, data_v.accountFromName, result.user_banknumber, result.bank_id, data_v.accountToName, body_amount, data_v.pccTraceNo, data_v.sequence, data_v.terminalNo, data_v.transactionToken, data_v.transferType))
                            if (res_confirmationn.status.code == "1000") { // confirmation สำเร็จ
                                var data_c = res_confirmationn.data

                                // เพิ่มประวัติในฐานข้อมูล INSERT VALUE tb_transaction
                                TransactionAdd(data_c.transactionDateTime, body_amount, remark, "D", userid, function (err, data) {
                                    if (data) {

                                        WalletWithdraw(data_transaction[0].txnAmount, userid, async function (err, data) {
                                            if (err) { // error SQL WALLET 
                                                console.log("error SQL WALLET")
                                                res.json({ result: err, status: "fail" })
                                            } else { // success ทำรายการถอนสำเร็จ 
                                                console.log("ทำรายการถอนเงินเสร็จสิ้น")
                                                res.json({ status: "success", message: `ทำรายการเติมเงินเสร็จสิ้น!!`, userID: body_userID, amount: data_transaction[0].txnAmount })
                                            }
                                        })

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