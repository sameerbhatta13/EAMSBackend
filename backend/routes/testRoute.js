const express=require('express')
const { testFunction } = require('../controller/testcontroller')
const router=express.Router()

router.get('/demo',testFunction)




//this is the default method (module.exports)
module.exports=router