const express=require('express')
const { postEmp, getEmployeeId, getEmployeeProfile, getAllEmployee, updateEmployee, deleteEmployee, employeeProfile } = require('../controller/empController')
const { uploads, handleMulterError } = require('../middleware/file-upload')
const authenticate = require('../middleware/authenticate')
const { requireAdmin } = require('../controller/userController')

const router=express.Router()

router.post('/registeremp',uploads.single('profilePicture'),handleMulterError,postEmp)
router.get('/getemployeeId/:id',getEmployeeId)
router.get('/profile',authenticate,getEmployeeProfile)
router.get('/allemployees',getAllEmployee)
router.put('updateemployee/:id',updateEmployee)
router.delete('/deleteemployee/:id',deleteEmployee)
router.get('/getprofile/:employeeId',employeeProfile)

module.exports=router