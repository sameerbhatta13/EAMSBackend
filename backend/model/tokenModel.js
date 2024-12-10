const mongoose=require('mongoose')

const {ObjectId}=mongoose.Schema

const tokenSchema=new mongoose.Schema({
    token:{
        type:String,
        require:true
    },
    userId:{
        type:ObjectId,
        ref:'User',
        require:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:86400
    }
})

module.exports=mongoose.model('Token',tokenSchema)