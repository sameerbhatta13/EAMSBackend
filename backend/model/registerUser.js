const mongoose = require('mongoose');
const uuidv1=require('uuidv1');
const crypto=require('crypto')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    // match: /.+\@.+\..+/  // Basic regex to validate email format
  },
  hashed_password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: false,
    trim: true,
    // match: /^[0-9]{10}$/  // Assuming a 10-digit phone number
  },
  role: {
    type: String,
    enum: ['employee', 'admin'],
    default: 'employee'
  },
  salt:String,
  isVerified:{
    type:Boolean,
    default:false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

userSchema.virtual('password')
.set(function(password){
    this._password=password
    this.salt=uuidv1()
    this.hashed_password=this.encryptPassword(password)
})
.get(function(){
    return this.hashed_password
})

//defining methods 
userSchema.methods={
    encryptPassword: function(password){
        if(!password){
            return ''
        }
        try {
            return crypto
            .createHmac('sha1',this.salt)
            .update(password)
            .digest('hex')
        } catch (error) {
        
        }
    },
    authenticate:function(plainText){
        return this.encryptPassword(plainText)===this.hashed_password
    }
}

module.exports = mongoose.model('User', userSchema);
