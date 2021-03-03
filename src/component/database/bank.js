const routes = require('express').Router();
const conn = require('../../util/connectDB');

// bank all ดึงข้อมูลธนาคารทั้งหมด
routes.get('/bank/all', (req, res) => {
    var sql = `SELECT * FROM tb_bank`;
    conn.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            res.json({ status: "fail", massage: err })
        } else {
            res.json({ status: "success", result })
        }
    })
});

module.exports = routes;