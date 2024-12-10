const mongoose=require('mongoose')
const Employee=require('../model/employeeModel')

const {ObjectId}=mongoose.Schema

const attendanceSchema=new mongoose.Schema({
   
    employeeId:{
        type:ObjectId,
        ref:'Employee',
        required:true
    },
    date:{
        type:Date,
        required:true

    },
    status:{
        type:String,
        enum:['present','absent','leave'],
        required:true
    },
    checkInTime:{
        type:Date,
        required:true
    },
    checkOutTime:{
        type:Date,
       
    },
    isLate: {
        type: Boolean, // True if employee is late
        default: false
    },
    isEarlyCheckout: {
        type: Boolean, // True if employee checked out early
        default: false
    }
},{timestamps:true})

module.exports=mongoose.model('Attendance',attendanceSchema)