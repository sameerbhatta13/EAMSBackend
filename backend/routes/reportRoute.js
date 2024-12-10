const express=require('express')
const { generateEmployeeReport } = require('../controller/reportController')

const router=express.Router()

router.get('/generatedreport/:employeeid',generateEmployeeReport)

module.exports=router