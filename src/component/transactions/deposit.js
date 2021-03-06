const routes = require('express').Router();
const { API_V1 } = require('../../util/config');
const { LoginRefresh } = require('../scb/login');
const { Transaction } = require('../scb/transactions');
const { WalletTopup } = require('../../sql/wallet')
const { TransactionAdd, TransactionDepositFindByUUID } = require('../../sql/transaction')
const { UserFindByUserid } = require('../../sql/user')

const tranfer = "รับโอนจาก";
const prompay = "PromptPay";

routes.post(`${API_V1}/transaction/deposit`, async (req, res) => {
    // req.body
    const body_userID = req.body.userID
    const body_amount = req.body.amount

    const error = { status: "fail", message: "ไม่สามารถทำรายการฝากเงินได้" }

    if (body_userID && body_amount) { // ตรวจสอบ REQUES BODY
        // ค้นหาข้อมูลสมาชิก SELECT tb_user
        UserFindByUserid(body_userID, async function (err, result) {
            if (result) {
                var userid = result.user_id
                var bankNumber = result.user_banknumber.substr(-6) // str.substr(-4); ตัดข้อความเหลือ 4 ตัวสุดท้าย
                var remark = `${result.bank_abbrev_th} (${result.bank_abbrev_en}) /X${bankNumber}` // remark = "กรุงเทพ (BBL) /X156178"

                // LOGIN เพื่อใช้ token
                const access_token = JSON.parse(await LoginRefresh()).data.access_token;
                if (access_token) {

                    // ตรวจสอบประวัติการทำรายการ
                    const res_transaction = JSON.parse(await Transaction(access_token)) // transaction SCB
                    if (res_transaction.status.code == 1000) { // มีประวัติการทำรายการ

                        const data_transaction = res_transaction.data.txnList.filter(item => item.txnRemark.includes(remark)); // ตรวจสอบว่ามีการโอนเงินเข้ามามั้ย ของบัญชีนี้
                        if (data_transaction[0]) { // มีการโอนเข้ามา

                            TransactionDepositFindByUUID(body_userID, async function (err, transaction_result) { // ตรวจสอบประวัติการโอนเงิน ซ้ำมั้ย DB tb_transaction
                                if (transaction_result) {

                                    var status_transaction = true
                                    // ตรวจสอบว่าเคยมีประวัติการโอนเงิน หรือยัง
                                    res_transaction.data.txnList.forEach(item_scb => {
                                        transaction_result.forEach(item_db => {

                                            if (
                                                item_scb.txnRemark.includes(item_db.transaction_remark) &&
                                                item_scb.txnDateTime == item_db.transaction_datetime &&
                                                item_scb.txnDebitCreditFlag == item_db.transaction_creditflag &&
                                                item_scb.txnAmount == item_db.transaction_amount
                                            ) {
                                                // มีข้อมูลการเติมเงินแล้ว (ไม่เติมซ้ำ)
                                                status_transaction = false
                                            }
                                        });
                                    });

                                    if (status_transaction) {
                                        // เพิ่มประวัติในฐานข้อมูล INSERT VALUE tb_transaction
                                        TransactionAdd(data_transaction[0].txnDateTime, body_amount, remark, "C", userid, function (err, data) {
                                            if (data) { // success ทำรายการถอนสำเร็จ 

                                                WalletTopup(body_amount, userid, async function (err, data) {
                                                    if (err) { // error SQL WALLET 
                                                        console.log("error SQL WALLET")
                                                        res.json({ result: err, error: error, status: "fail" })
                                                    } else {
                                                        console.log("ทำรายการถอนเงินเสร็จสิ้น")
                                                        res.json({ status: "success", message: "ทำรายการเติมเงินเสร็จสิ้น!", userID: body_userID, amount: body_amount, status: "success" })
                                                    }
                                                })

                                            } else { // error SQL ADD TRANSACTION
                                                res.json({ result: err, error: error })
                                            }
                                        });

                                    } else { // มีข้อมูลการเติมเงินแล้ว (ไม่เติมซ้ำ)
                                        console.log("มีข้อมูลการเติมเงินแล้ว (ไม่เติมซ้ำ)")
                                        res.json(error)
                                    }

                                } else { // error SQL transaction
                                    res.json({ result: err, error: error, status: "fail" })
                                }
                            })

                        } else { // ไม่พบประวัติการโอนเงิน
                            console.log("err ไม่พบประวัติการโอนเงิน")
                            res.json(error)
                        }

                    } else { // err ไม่มีข้อมูลการทำรายการ
                        console.log("err ไม่มีข้อมูลการทำรายการ")
                        res.json(error)
                    }

                } else { // error LOGIN
                    console.log("error LOGIN")
                    res.json(error)
                }

            } else { // error SQL USER FIND BY USERID
                res.json({ result: err, error: error, status: "fail" })
            }
        })

    } else {
        console.log("error ไม่มี BODY")
        res.json(error)
    }

})

module.exports = routes;