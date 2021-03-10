const routes = require('express').Router();
const { API_V1 } = require('../../util/config');
const { LoginRefresh } = require('../scb/login');
const { Transaction } = require('../scb/transactions');
const { TransactionAdd, TransactionDepositFindByUUID } = require('../../sql/transaction')
const { UserFindByUserid } = require('../../sql/user');
const { Deposit } = require('../superlot/transfer');

const tranfer = "รับโอนจาก";
const prompay = "PromptPay";

// ฝาก
routes.post(`${API_V1}/transfer/deposit`, async (req, res) => {
    // req.body
    const body_userID = req.body.userID

    const error = { status: "fail", message: "ไม่สามารถทำรายการฝากเงินได้" }
    const error5001 = { status: "fail", message: "ไม่สามารถทำรายการฝากเงินได้ \nไม่พบประวัติการฝากเงินเข้าระบบ" }
    const error5002 = { status: "fail", message: "ทางระบบได้เติมเงินเข้าบัญชีท่านแล้ว \nกรุณาตรวจสอบโดยการกด 'เช็คยอด'" }

    if (body_userID) { // ตรวจสอบ REQUES BODY
        // ค้นหาข้อมูลสมาชิก SELECT tb_user
        UserFindByUserid(body_userID, async function (err, result) {
            if (result) {
                var userid = result.user_id
                var username = result.user_username
                var bankNumber6 = result.user_banknumber.substr(-6) // str.substr(-4); ตัดข้อความเหลือ 4 ตัวสุดท้าย
                var bankNumber4 = result.user_banknumber.substr(-4) // str.substr(-4); ตัดข้อความเหลือ 4 ตัวสุดท้าย
                var remark = `${result.bank_abbrev_th} (${result.bank_abbrev_en}) /X${bankNumber6}` // remark = "กรุงเทพ (BBL) /X156178"
                var remark_scb = `รับโอนจาก ${result.bank_abbrev_en} x${bankNumber4} ${result.user_name}` // remark = "รับโอนจาก SCB x8047 นาย กฤติกร จิตประภาจ"

                TransactionDepositFindByUUID(body_userID, async function (err, transaction_result) { // ตรวจสอบประวัติการโอนเงิน ซ้ำมั้ย DB tb_transaction
                    if (transaction_result) {

                        // LOGIN เพื่อใช้ token
                        const res_login = await LoginRefresh();
                        if (res_login.status.code == "1000") {
                            const access_token = res_login.data.access_token;

                            // ตรวจสอบประวัติการทำรายการ
                            const res_transaction = await Transaction(access_token) // transaction SCB
                            if (res_transaction.status.code == 1000) { // มีประวัติการทำรายการ

                                console.log(remark)
                                const data_transaction = res_transaction.data.txnList.filter(item => remark.includes(item.txnRemark) || remark_scb.includes(item.txnRemark)); // ตรวจสอบว่ามีการโอนเงินเข้ามามั้ย ของบัญชีนี้
                                if (data_transaction[0]) { // มีการโอนเข้ามา

                                    var status_transaction = true
                                    // ตรวจสอบว่ามีประวัติการโอนที่ยังไม่อนุมัติหรือยัง
                                    transaction_result.forEach(item_db => {
                                        if (
                                            data_transaction[0].txnRemark.includes(item_db.transaction_remark) &&
                                            data_transaction[0].txnDateTime == item_db.transaction_datetime &&
                                            data_transaction[0].txnDebitCreditFlag == item_db.transaction_creditflag &&
                                            data_transaction[0].txnAmount == item_db.transaction_amount
                                        ) {
                                            // มีประวัติการเติมเงินแล้ว (ไม่เติมซ้ำ)
                                            status_transaction = false
                                        }
                                    });

                                    if (status_transaction) {
                                        // เพิ่มประวัติในฐานข้อมูล INSERT VALUE tb_transaction
                                        TransactionAdd(data_transaction[0].txnDateTime, data_transaction[0].txnAmount, data_transaction[0].txnRemark, "C", userid, async function (err, data) {
                                            if (data) { // success ทำรายการถอนสำเร็จ 

                                                const res_deposit = await Deposit(username, data_transaction[0].txnAmount)
                                                if (res_deposit.amount) {
                                                    console.log("ทำรายการเติมเงินสำเร็จ")
                                                    console.log({ result: res_deposit, status: "success" })
                                                    res.json({ result: res_deposit, status: "success" })
                                                } else if(res_deposit.message){ // error 
                                                    console.log("supper lot : " + res_deposit.message)
                                                    res.json(error)
                                                } else {
                                                    console.log("supper lot : error");
                                                    res.json(error)
                                                }

                                            } else { // error SQL ADD TRANSACTION
                                                console.log("error SQL ADD TRANSACTION")
                                                res.json({ result: err, status: "fail" })
                                            }
                                        });

                                    } else { // มีข้อมูลการเติมเงินแล้ว (ไม่เติมซ้ำ)
                                        console.log("มีข้อมูลการเติมเงินแล้ว (ไม่เติมซ้ำ)")
                                        res.json(error5002)
                                    }

                                } else { // ไม่พบประวัติการโอนเงิน
                                    console.log("err ไม่พบประวัติการโอนเงินเข้าบัญชีฝาก")
                                    res.json(error5001)
                                }

                            } else if (res_transaction.status.code == 1011) { // err ไม่มีข้อมูลการทำรายการ
                                console.log("err ไม่มีข้อมูลการทำรายการ")
                                res.json(error5001)

                            } else { // error SCB transaction
                                console.log("error SCB transaction")
                                res.json(error)
                            }

                        } else { // error LOGIN
                            console.log("error LOGIN")
                            res.json(error)
                        }

                    } else { // error SQL transaction
                        console.log("error SQL transaction")
                        res.json({ result: err, status: "fail" })
                    }
                })

            } else { // error SQL USER FIND BY USERID
                console.log("error SQL USER FIND BY USERID")
                res.json({ result: err, status: "fail" })
            }
        })

    } else { // error NO BODY
        console.log("error ไม่มี BODY")
        res.json(error)
    }

})

module.exports = routes;