const express=require('express')
const { markAttendance, getAllAttendance } = require('../controller/attendanceController')
const router=express.Router()

router.post('/markattendance',markAttendance)
router.get('/getattendance/:employeeId',getAllAttendance)


module.exports=router