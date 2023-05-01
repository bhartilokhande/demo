const express = require('express');
const router = express.Router();
const user = require('../controller/user');
const user_authorization = require('../middleware/user_authorization')



router.post('/applyLeave',user.applyLeave);
router.get('/getProject',user.getProject);
router.get('/getLeavelist',user.getLeaveList);



module.exports = router;
