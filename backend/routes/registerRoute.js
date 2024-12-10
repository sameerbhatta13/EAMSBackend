const express=require('express')
const { postUser, postEmailConfirmation, singIn, forgetPassword, resetPassword, getUserById, updateUser, deleteUser, getUserStatus } = require('../controller/userController')


const router=express.Router()

router.post('/postUser',postUser)
router.put('/confirmation/:token',postEmailConfirmation)
router.post('/signin',singIn)
router.post('/forget/password',forgetPassword)
router.put('/reset/password/:token',resetPassword)
router.get('/userdetail/:id',getUserById)
router.put('/updateuser',updateUser)
router.delete('deleteuser',deleteUser)
router.get('/status',getUserStatus)
 
module.exports=router     