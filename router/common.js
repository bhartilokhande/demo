const express = require('express');
const router = express.Router();
const common = require('../controller/common');
const upload = require('../middleware/upload')




router.get('/getAllEmployee',common.getAllEmployee);
router.get('/getEmployee',common.getEmployee);
router.get('/getProject',common.getProject);
router.post('/getHash',upload.single('image'),common.getHash);







module.exports = router;
    