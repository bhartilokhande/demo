const express = require('express');
const router = express.Router();
const admin = require('../controller/admin');
const authorization = require('../middleware/authorization')





router.post('/addEmployee',authorization,admin.addEmployee);
router.put('/editEmployee',authorization,admin.updateEmployee);
router.delete('/deleteEmployee',authorization,admin.deleteEmployee)

router.post('/addProject',authorization,admin.addProject)
router.get('/projectList',admin.getProject)
router.delete('/deleteProject',authorization,admin.deleteProject)
router.put('/updateProject',authorization,admin.updateProject)
router.get('/getLeavelist',authorization,admin.leaveList)
router.put('/updateLeave',admin.updateLeaveStatus)


module.exports = router;
























