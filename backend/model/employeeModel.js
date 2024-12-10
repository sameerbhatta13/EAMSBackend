const mongoose = require('mongoose')

const empSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName:
    {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone:
    {
        type: String

    },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String }
    },
    position: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required:true
    },
    dateOfJoining: {
        type: Date,
        default: Date.now,
        required:true
    },
    salary: {
        type: Number,
        required:true
    },
    profilePicture: { 
        type: String ,
        required:true
    },
    // employeeId: { 
    //     type: String, 
    //     unique: true, 
    //     required: true, 
    //     default: function() {
    //         return `EMP-${Date.now()}`; // Example: EMP-1660123456789
    //     } 
    // },
    isRegistered: { 
        type: Boolean,
         default: false 
    },
    seniorityLevel: { 
        type: Number, 
        required: true, 
        default: 3 //  1 = Most Senior, 4 = Most Junior 
    },
    leaveBalance: { 
        type: Number, 
        required: true, 
        default: 12 //  12 annual leaves 
    },

},{timestamps:true})

module.exports=mongoose.model('Employee',empSchema)