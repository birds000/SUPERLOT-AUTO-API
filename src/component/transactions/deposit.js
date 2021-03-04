const routes = require('express').Router();
const { API_V1 } = require('../../util/config');
const { UserFindByUserid } = require('../../sql/user')
const { TransactionAdd, TransactionDepositFindByUUID } = require('../../sql/transaction')
const { WalletTopup } = require('../../sql/wallet')

routes.post(`${API_V1}/transaction/deposit`, async (req, res) => {
    // req.body
    const body_userID = req.body.userID
    const body_amount = req.body.amount

    const error = { status: "fail", message: "ไม่สามารถทำรายการฝากเงินได้" }

    // ค้นหาข้อมูลสมาชิก SELECT tb_user
    UserFindByUserid(body_userID, async function (err, user_data) {
        if (user_data) {
            const result = JSON.parse(user_data).result[0]
            var userid = result.user_id
            var bankNumber = result.user_banknumber.substr(-4) // str.substr(-4); ตัดข้อความเหลือ 4 ตัวสุดท้าย
            var remark = `รับโอนจาก ${result.bank_abbrev_en} x${bankNumber} ${result.user_name}` // remark = "รับโอนจาก BBL x6178 น.ส. ปราวีณา บุญมา"

            // LOGIN เพื่อใช้ token
            const access_token = JSON.parse(await LoginRefresh()).data.access_token;
            if (access_token) {

                // ตรวจสอบประวัติการทำรายการ
                const res_transaction = JSON.parse(await Transaction(access_token)) // transaction SCB
                if (res_transaction.status.code == 1000) { // มีประวัติการทำรายการ

                    TransactionDepositFindByUUID(body_userID, async function (err, transaction_data) { // ตรวจสอบประวัติการโอนเงิน DB tb_transaction
                        if (transaction_data) {
                            const transaction_result = JSON.parse(transaction_data).result

                            var status_transaction = true
                            res_transaction.data.txnList.forEach(item_scb => {
                                transaction_result.forEach(item_db => {
                                    if (
                                        item_scb.txnRemark.includes(item_db.transaction_remark) &&
                                        item_scb.txnDateTime == item_db.transaction_datetime &&
                                        item_scb.txnDebitCreditFlag == item_db.transaction_creditflag &&
                                        item_scb.txnAmount == item_db.transaction_amount
                                    ) {
                                        // มีข้อมูลการเติมเงินแล้ว (ไม่เติมซ้ำ)
                                        status = false
                                    }
                                });
                            });

                            if (status_transaction) { // ทำการเติมเงินเข้าระบบ
                                // เพิ่มประวัติในฐานข้อมูล INSERT VALUE tb_transaction
                                TransactionAdd(data_c.transactionDateTime, body_amount, remark, "C", userid, function (err, data) {
                                    if (data) { // success ทำรายการถอนสำเร็จ 

                                        WalletTopup(body_amount, userid, async function (err, data) {
                                            if (err) { // error SQL WALLET 
                                                console.log("error SQL WALLET")
                                                res.json({ result: err, error: error })
                                            } else {
                                                console.log("ทำรายการถอนเงินเสร็จสิ้น")
                                                res.json({ status: "success", message: "ทำรายการเติมเงินเสร็จสิ้น!", userID: body_userID, amount: body_amount })
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
                            res.json({ result: err, error: error })
                        }
                    })

                } else { // err ไม่มีข้อมูลการทำรายการ
                    console.log("err ไม่มีข้อมูลการทำรายการ")
                    res.json(error)
                }

            } else { // error LOGIN
                console.log("error LOGIN")
                res.json(error)
            }

        } else { // error SQL USER FIND BY USERID
            res.json({ result: err, error: error })
        }
    })

})

module.exports = routes;