const mongoose = require('mongoose')
const Employee=require('../model/employeeModel')
const {ObjectId}=mongoose.Schema

const leaveSchema=new mongoose.Schema({
    // Id:{
    //     type:ObjectId,
    //     ref:'Employee',
    //     required:true
    // },
    employeeId:{
        type:ObjectId,
        ref:'Employee',
        required:true
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    reason:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['pending','approved','rejected'],
        default:'pending'
    },
    requestedAt:{
        type:Date,
        default:Date.now()
    },
    priority: { type: Number, default: 0 }
})

module.exports=mongoose.model('Leave',leaveSchema)