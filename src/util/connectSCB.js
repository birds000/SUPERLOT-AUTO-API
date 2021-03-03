
const SCB_API = 'https://fasteasy.scbeasy.com:8443';
const API_REFRESH = '3ac591e5-c9e3-4ef5-8919-051050dae116';
const DEVICEID = '35f37d36-b091-483e-95d4-1c4c7bbbc9fc' //รหัสธาคาร ระบุตัวตน

// ข้อมูลบัญชี
const ACCOUNT_FROM = "4094138047" // กำนหด บัญชีผู้โอน (เรา)
const ACCOUNT_FROMTYPE = "2" // กำหนด ประเภทบัญชีผู้โอน (เรา)
const TRANSFER_TYPE = "ORFT" // ประเภทการโอนเงิน 

module.exports = {
    SCB_API,
    API_REFRESH,
    DEVICEID,
    ACCOUNT_FROM,
    ACCOUNT_FROMTYPE,
    TRANSFER_TYPE
};