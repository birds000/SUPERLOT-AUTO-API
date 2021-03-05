const routes = require('express').Router();
const { API_V1 } = require('../../util/config');
const { LoginRefresh } = require('../scb/login');
const { Transaction } = require('../scb/transactions');
const { Verification, Confirmation } = require('../scb/transfer');
const { TransactionAdd, TransactionWithdrawFindByUUID } = require('../../sql/transaction')
const { UserFindByUserid } = require('../../sql/user')

routes.post(`${API_V1}/transaction/withdraw`, async (req, res) => {
    // req.body
    const body_userID = req.body.userID
    const body_amount = req.body.amount
    const body_accountTo = req.body.accountTo
    const body_accountToBankCode = req.body.accountToBankCode

    const error = { status: "fail", message: "ไม่สามารถทำรายการถอนเงินได้" }
    const error1001 = { status: "fail", message: "จำนวนเงินไม่เพียงพอ ไม่สามารถทำรายการถอนเงินได้" }

    if (body_userID && body_amount && body_accountTo && body_accountToBankCode) { // ตรวจสอบ REQUES BODY
        // ค้นหาข้อมูลสมาชิก SELECT tb_user
        UserFindByUserid(body_userID, async function (err, user_data) {
            if (user_data) {
                const result = JSON.parse(user_data).result[0]
                var userid = result.user_id
                var bankNumber = result.user_banknumber.substr(-4) // str.substr(-4); ตัดข้อความเหลือ 4 ตัวสุดท้าย
                var remark = `โอนไป ${result.bank_abbrev_en} x${bankNumber} ${result.user_name}` // remark = "โอนไป BBL x6178 น.ส. ปราวีณา บุญมา"

                if (parseFloat(body_amount) <= parseFloat(result.wallet_balance)) { //ตรวจสอบจำนวนเงิน <= จำนวนเงินในกระเป๋า tb_wallet
                    TransactionWithdrawFindByUUID(body_userID, async function (err, transaction_data) { // ตรวจสอบประวัติการโอนเงิน DB tb_transaction
                        if (transaction_data) {
                            const transaction_result = JSON.parse(transaction_data).result

                            // SCB login
                            const access_token = JSON.parse(await LoginRefresh()).data.access_token;
                            if (access_token) {

                                // ตรวจสอบประวัติการถอนก่อน (เพื่อไม่ให้โอนซ้ำ)
                                var status_transaction = true // DEFULT ไม่พบกระวัติการถอน (ถอนได้) 
                                const res_transaction = JSON.parse(await Transaction(access_token)) // transaction SCB
                                if (res_transaction.status.code == 1000) { // มีประวัติการถอน ต้องตรวจสอบก่อน

                                    // วนรูปฐานข้อมูลตั้ง 
                                    // วนรูป ข้อมูล SCB เทียบ
                                    // ถ้าตรงกัน ให้ return false
                                    transaction_result.forEach(item_db => {
                                        res_transaction.data.txnList.forEach(item_scb => {
                                            // str.includes("world,") ค้นหาคำ ถ้ามีจะ TRUE / ไม่มี FALSE
                                            if (
                                                item_scb.txnRemark.includes(item_db.transaction_remark) &&
                                                item_scb.txnDateTime == item_db.transaction_datetime &&
                                                item_scb.txnDebitCreditFlag == item_db.transaction_creditflag &&
                                                item_scb.txnAmount == item_db.transaction_amount
                                            ) {
                                                status_transaction = false
                                            }
                                        });
                                    });

                                } else {
                                    status_transaction = false
                                }

                                if (status_transaction) { // ไม่มีประวัติการถอน||ซ้ำ (สามารถถอนเงินได้)
                                    // SCB verification สร้างบิล
                                    const res_verification = JSON.parse(await Verification(access_token, body_accountTo, body_accountToBankCode, body_amount))

                                    if (res_verification.status.code == "1000") { // verification สำเร็จ
                                        const data_v = res_verification.data

                                        // SCB confirmation ยืนยันการโอน
                                        const res_confirmationn = JSON.parse(await Confirmation(access_token, data_v.accountFromName, body_accountTo, body_accountToBankCode, data_v.accountToName, body_amount, data_v.pccTraceNo, data_v.sequence, data_v.terminalNo, data_v.transactionToken))
                                        if (res_confirmationn.status.code == "1000") { // confirmation สำเร็จ
                                            var data_c = res_confirmationn.data

                                            // เพิ่มประวัติในฐานข้อมูล INSERT VALUE tb_transaction
                                            TransactionAdd(data_c.transactionDateTime, body_amount, remark, "D", userid, function (err, data) {
                                                if (err) { // error SQL 
                                                    res.json({ result: err })
                                                } else { // success ทำรายการถอนสำเร็จ 
                                                    res.json({ result: res_confirmationn, userID: body_userID, amount: body_amount, message: "ทำรายการถอนเสร็จสิ้น!" })
                                                    console.log("ทำรายการถอนเงินเสร็จสิ้น")
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

                                } else { // มีประวัติการถอนซ้ำ  
                                    console.log("err : มีประวัติการถอนซ้ำ")
                                    res.json(error)
                                }

                            } else { // SCB Login ไม่สำเร็จ
                                console.log("err : SCB Login ไม่สำเร็จ")
                                res.json(error)
                            }

                        } else { // error SQL Transaction
                            res.json({ result: err, error: error })
                        }
                    })
                } else {
                    res.json(error1001)
                }

            } else { // error SQL USER FIND BY USERID
                res.json({ result: err, error: error })
            }
        });

    } else {

    }

})


module.exports = routes;