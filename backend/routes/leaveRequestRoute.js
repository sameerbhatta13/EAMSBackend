const express=require('express')
const { leaveController, getEmployeeLeaves, getAllLeaves, processLeaveRequest, updateLeaveStatus } = require('../controller/leaveRequestController')
const authenticate = require('../middleware/authenticate')

const router=express.Router()

router.post('/leaverequest',leaveController)
// router.get('/leaverecords/:employeeId',getEmployeeLeaves)
router.get('/getallleaves',getAllLeaves)
router.put('/processLeaveRequest/:leaveId', processLeaveRequest)
router.put('/updateLeaveStatus/:leaveId',updateLeaveStatus)


module.exports=router