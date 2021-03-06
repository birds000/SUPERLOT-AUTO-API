const routes = require('express').Router();
const { UserAll, UserUpdate, UserAdd, UserFindByUserid } = require('../../sql/user')
const { LoginRefresh } = require('../scb/login');
const { Verification } = require('../scb/transfer');

// user/userID/:user_id ดึงข้อมูล user_ID ที่ระบุ
routes.get('/user/userID/:userID', (req, res) => {
    console.log("Fething userID with..." + req.params.userID)
    const param_userID = req.params.userID

    const error = { status: "fail", message: "ไม่สามารถค้นหาสมาชิกได้" }

    if (param_userID) {
        UserFindByUserid(param_userID, async function (err, data) {
            if (err) {
                res.json(error)
            } else {
                if (data.length == 0) {
                    res.json(error);
                } else {
                    res.json({ result: data[0], status: "success" });
                }
                
            }
        })
    } else { // error NO BODY
        res.json(error)
    }
});

// UPDATE แก้ไขข้อมูลผู็เล่น
routes.post('/user/update', (req, res) => {
    const body_userID = req.body.userID;
    const body_bankID = req.body.bankID;
    const body_bankNumber = req.body.bankNumber;
    const body_telphone = req.body.telphone;

    const error = { status: "fail", message: "ไม่สามารถแก้ไขข้อมูลสมาชิกได้" }

    if (body_userID && body_bankID && body_bankNumber && body_telphone) {
        UserUpdate(body_bankID, body_bankNumber, body_telphone, body_userID, async function (err, data) {
            if (err) {
                res.json(error)
            } else {
                res.json({ result: data, status: "success", message: "แก้ไขข้อมูลเสร็จสิ้น!!" });
            }
        })
    } else { // error NO BODY
        res.json(error)
    }
})

// ADD เพิ่มผู้เล่น
routes.post('/user/add', async (req, res) => {
    console.log('/user/add')
    const body_userID = req.body.userID;
    const body_bankID = req.body.bankID;
    const body_bankNumber = req.body.bankNumber;
    const body_telphone = req.body.telphone;

    const error = { status: "fail", message: "ไม่สามารถเพิ่มสมาชิกได้" }

    if (body_userID && body_bankID && body_bankNumber && body_telphone) {
        UserAll(async function (err, data_user) {
            if (data_user) {
                var status_user = true
                data_user.forEach(item => {
                    if (item.user_userId == body_userID) {
                        status_user = false
                    }
                });
    
                if (status_user) { // ไม่มีชื่อผู้ใช้ในระบบ (สมัครได้)
                    // SCB login
                    const access_token = JSON.parse(await LoginRefresh()).data.access_token;
                    if (access_token) {
    
                        // SCB verification สร้างบิล
                        const res_verification = JSON.parse(await Verification(access_token, body_bankNumber, body_bankID, '1'))
                        console.log(res_verification)
                        if (res_verification.status.code == "1000") { // verification สำเร็จ
                            const data_v = res_verification.data
    
                            console.log(data_v)
                            UserAdd(body_userID, data_v.accountToName, body_telphone, data_v.accountTo, data_v.accountToBankCode, function (err, data) {
                                if (err) { // error SQL 
                                    res.json({ result: err })
                                } else { // success ทำรายการถอนสำเร็จ 
                                    res.json({ result: data, message: "สมัครสมาชิกเสร็จสิ้น!!", status: "success" })
                                    console.log("สมัครสมาชิกเสร็จสิ้น!!")
                                }
                            });
    
                        } else if (res_verification.status.code == "5009") { // error เลขที่บัญชีรับเงินไม่ถูกต้อง
                            console.log("error เลขที่บัญชีรับเงินไม่ถูกต้อง")
                            res.json({ result: res_verification, error: error })
    
                        } else { // error Verification
                            console.log("error Verification")
                            res.json(error)
                        }
    
                    } else { // error LOGIN SCB
                        console.log("error LOGIN SCB")
                        res.json(error)
                    }
                } else { // error มีข้อมูล USER แล้ว
                    console.log("error มีข้อมูล USER แล้ว")
                    res.json(error)
                }
    
            } else { // error SQL USER ALL
                res.json({ result: err })
            }
        });

    } else { // error NO BODY
        res.json(error)
    }
   
})

module.exports = routes;