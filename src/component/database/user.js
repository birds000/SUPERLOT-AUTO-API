const routes = require('express').Router();
const { API_V1 } = require('../../util/config')
const { UserAll, UserUpdate, UserAdd, UserRandom, UserFindByUserid, UserFindByID } = require('../../sql/user')
const { GetMember, CreateMember } = require('../superlot/user')
const { LoginRefresh } = require('../scb/login');
const { Verification } = require('../scb/transfer');

// user/userID/:user_id ดึงข้อมูล user_ID ที่ระบุ
routes.get(`${API_V1}/user/userID/:userID`, (req, res) => {
    console.log("Fething userID with..." + req.params.userID)
    const param_userID = req.params.userID

    const error = { status: "fail", message: "ไม่สามารถค้นหาสมาชิกได้" }

    if (param_userID) {
        UserFindByUserid(param_userID, async function (err, data) {
            if (err) {
                res.json(error)
            } else {
                if (data.user_username) {
                    const superlot = await GetMember(data.user_username);
                    const result = {
                        ...data,
                        superlot
                    }
                    res.json({ result: result, status: "success" });
                } else {
                    res.json(error);
                }
            }
        })
    } else { // error NO BODY
        res.json(error)
    }
});

// UPDATE แก้ไขข้อมูลผู็เล่น
routes.post(`${API_V1}/user/update`, (req, res) => {
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
routes.post(`${API_V1}/user/add`, async (req, res) => {
    const body_userID = req.body.userID;
    const body_bankID = req.body.bankID;
    const body_bankNumber = req.body.bankNumber;
    const body_telphone = req.body.telphone;

    const error = { status: "fail", message: "ไม่สามารถเพิ่มสมาชิกได้ กรุณาติดต่อ Admin" }

    if (body_userID && body_bankID && body_bankNumber && body_telphone) {
        console.log("/user/add");
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
                    const res_login = await LoginRefresh();
                    if (res_login.status.code == "1000") {
                        const access_token = res_login.data.access_token;
                        
                        // SCB verification สร้างบิล
                        const res_verification = await Verification(access_token, body_bankNumber, body_bankID, '1')
                        if (res_verification.status.code == "1000") { // verification สำเร็จ
                            const data_v = res_verification.data
    
                            UserAdd(body_userID, data_v.accountToName, body_telphone, data_v.accountTo, data_v.accountToBankCode, async function (err, data) {
                                if (err) { // error SQL 
                                    res.json({ result: err, status: "fail" })

                                } else { // เพิ่มสมาชิกสำเร็จ
                                    const res_createMember = await CreateMember(data.user_username, data.user_password, data.user_name, data.user_phone);
                                    console.log(res_createMember)
                                    if (res_createMember.success == true) {
                                        res.json({ result: data, status: "success" })

                                    } else if(res_createMember.message == "ชื่อผู้ใช้ ถูกใช้แล้ว"){ // error ชื่อผู้ใช้ ถูกใช้แล้ว Supper lot
                                        console.log("ชื่อผู้ใช้ ถูกใช้งานแล้ว Supper lot")
                                        res.json(error)

                                    } else { // error CreateMember Super lot
                                        console.log("error CreateMember Super lot")
                                        res.json(error)
                                    }
                                }
                            });
    
                        } else if (res_verification.status.code == "5009") { // error เลขที่บัญชีรับเงินไม่ถูกต้อง
                            console.log("error เลขที่บัญชีรับเงินไม่ถูกต้อง")
                            res.json({ result: res_verification, status: "fail" })
    
                        } else if (res_verification.status.code == "7001") { // error ยอดเงินในบัญชีไม่พอ
                            console.log("error ยอดเงินในบัญชีไม่เพียงพอ")
                            res.json(error)
                        }else { // error Verification
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
                res.json({ result: err, status: "fail" })
            }
        });

    } else { // error NO BODY
        res.json(error)
    }
   
})

module.exports = routes;