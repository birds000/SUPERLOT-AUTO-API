const routes = require('express').Router();
// const axios = require('axios');
const { URL, PORT, API_V1 } = require('../../util/config');
// const { SCB_API, API_REFRESH, API_AUTH, DEVICEID } = require('../../util/connectSCB')
const { LoginRefresh } = require('../scb/login');
const { Tansaction } = require('../scb/tansactions');
const { Verification, Confirmation } = require('../scb/transfer');
const { TansactionAdd, TansactionFindByUUID } = require('../../sql/transaction')
const { UserFindByUserid } = require('../../sql/user')

// // tansaction Lv.1
// // วนลูป Tansaction ในฐานข้อมูล DB เทียบกับ SCB
async function TansactionsV1(access_token, value) {
    
}

routes.post(`${API_V1}/transaction/withdraw`, async (req, res) => {
    // req.body
    const body_userID = req.body.userID
    const body_amount = req.body.amount
    const body_accountTo = req.body.accountTo
    const body_accountToBankCode = req.body.accountToBankCode

    const error = { status: "fail", message: "ไม่สามารถทำรายการถอนเงินได้" }

    TansactionFindByUUID(body_userID, async function (err, tansaction_data) {
        if (tansaction_data) {
            const tansaction_result = JSON.parse(tansaction_data).result

            // SCB login
            const access_token = JSON.parse(await LoginRefresh()).data.access_token;
            if (access_token) {

                var status_tansaction = true // DEFULT ไม่พบกระวัติการถอน (ถอนได้) 
                const res_tansaction = JSON.parse(await Tansaction(access_token)) // Tansaction SCB
                if (res_tansaction.status.code == 1000) { // มีประวัติการถอน ต้องตรวจสอบก่อน
                   
                    // วนรูปฐานข้อมูลตั้ง 
                        // วนรูป ข้อมูล SCB เทียบ
                            // ถ้าตรงกัน ให้ return false
                    tansaction_result.forEach(item_db => {
                        res_tansaction.data.txnList.forEach(item_scb => {
                            // str.includes("world,") ค้นหาคำ ถ้ามีจะ TRUE / ไม่มี FALSE
                            if (item_scb.txnRemark.includes(item_db.transaction_remark) && item_scb.txnDateTime == item_db.transaction_datetime) {
                                status_tansaction = false
                            }
                        });
                    });
                    
                } else if (res_tansaction.status.code == 1002){ // CODE 1002 ไม่สามารถดำเนินการต่อได้ LOGIN ใหม่
                    status_tansaction = false
                }

                if (status_tansaction) { // ไม่มีประวัติการถอน||ซ้ำ (สามารถถอนเงินได้)
                    // SCB verification สร้างบิล
                    const res_verification = JSON.parse(await Verification(access_token, body_accountTo, body_accountToBankCode, body_amount))

                    if (res_verification.status.code == "1000") { // verification สำเร็จ
                        const data_v = res_verification.data

                        // SCB confirmation ยืนยันการโอน
                        const res_confirmationn = JSON.parse(await Confirmation(access_token, data_v.accountFromName, body_accountTo, body_accountToBankCode, data_v.accountToName, body_amount, data_v.pccTraceNo, data_v.sequence, data_v.terminalNo, data_v.transactionToken))

                        if(res_confirmationn.status.code == "1000") { // confirmation สำเร็จ
                            var data_c = res_confirmationn.data

                            // ค้นหาข้อมูลสมาชิก SELECT tb_user
                            UserFindByUserid(body_userID, async function (err, user_data) {
                                if (user_data) {
                                    // str.substr(-4); ตัดข้อความเหลือ 4 ตัวสุดท้าย
                                    const result = JSON.parse(user_data).result[0]
                                    var userid = result.user_id
                                    // remark = "โอนไป BBL x6178 น.ส. ปราวีณา บุญมา"
                                    var bankNumber = result.user_banknumber.substr(-4)
                                    var remark = `โอนไป BBL x${bankNumber} ${result.user_name}`

                                    // เพิ่มประวัติในฐานข้อมูล INSERT VALUE tb_transaction
                                    TansactionAdd(data_c.transactionDateTime, body_amount, remark, userid, function (err, data) {
                                        if (err) { // error SQL 
                                            res.json({ result: err }) 
                                        } else { // success ทำรายการถอนสำเร็จ 
                                            // res.json({ result: res_confirmationn, userID: body_userID, amount: body_amount, message: "ทำรายการถอนเสร็จสิน!" })
                                            res.json({ userID: body_userID, amount: body_amount, message: "ทำรายการถอนเสร็จสิน!" })
                                        }
                                    });

                                } else { // error SQL
                                    res.json({ result: err, error: error })
                                }
                            });

                        } else { // SCB confirmation ไม่สำเร็จ
                            res.json(error)
                        }

                    } else { // SCB verification ไม่สำเร็จ
                        res.json(error)
                    }

                } else { // มีประวัติการถอนซ้ำ  
                    res.json(error)
                }

            } else { // SCB Login ไม่สำเร็จ
                res.json(error)
            }

        } else { // error SQL
            res.json({ result: err, error: error })
        }
    })

})


module.exports = routes;