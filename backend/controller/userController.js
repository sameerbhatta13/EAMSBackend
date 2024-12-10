
const User = require('../model/registerUser')
const Token=require('../model/tokenModel')
const crypto=require('crypto')
const sendEmail=require('../utils/setEmail')
const jwt= require('jsonwebtoken') // authentication
const {expressjwt}=require('express-jwt') //authorization
const path=require('path')
const fs=require('fs')


exports.postUser = async (req, res) => {
  try {
    const { username, email, password, phone, role } = req.body

    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already in use" })
    }
    if (!['employee', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    // Create a new user instance
    const newUser = new User({
      username,
      email,
      password, // Remember to hash the password for production-level security
      phone,
      role
    })
//working for token
    let token=new Token({
      token:crypto.randomBytes(16).toString('hex'),
      userId:newUser._id
    })
    token=await token.save()
    if(!token){
      return res.status(400).json({error:'failed to create a token'})
    }
    //load email template
    const templatePath=path.join(__dirname,'emailTemplate.html')
    let emailTemplate=fs.readFileSync(templatePath,'utf-8')

    //verification url
    const verificationUrl=`${process.env.FRONTEND_URL}/email/confirmation/${token.token}`

    emailTemplate=emailTemplate.replace("{{url}}",verificationUrl)

    //send email process
    sendEmail({
      from:'no-reply@online-store.com',
      to:newUser.email,
      subject:'email verification link',
      text:`hello ,\n\n please verify your email by using below link \n\n 
      http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`,
      html: emailTemplate
    })

    // Save the new user
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};


//confirming the email

exports.postEmailConfirmation=(req,res)=>{
//at first find the valid or matching token
  Token.findOne({token:req.params.token})
  .then(token=>{
    if(!token){
      return res.status(400).json({error:'invalid token or token have expired'})
    }
    //if we find the valid token then find the valid user for that token
    User.findOne({_id:token.userId})
    .then(newUser=>{
      if(!newUser){
        return res.status(400).json({error:'we are unable to find valid user for this token'})
      }
      //check if user is already verified or not
      if(newUser.isVerified){
        return res.status(400).json({error:'emial is already verififed'})
      }

      //save the verified user
      newUser.isVerified=true
      newUser.save()
      .then(newUser=>{
        if(!newUser){
          return res.status(400).json({error:'failed to verify email try again'})
        }
        res.json({msg:'your email has been verfied , login to continue'})
      })
      .catch(err=>{
        return res.status(400).json({error:err})
      })
    })
    .catch(err=>{
      return res.status(400).json({error:err})
    })
  })
  .catch(err=>{
    return res.status(400).json({error:err})
  })
}

//sign in process

exports.singIn=async(req,res)=>{
  const {email,password}=req.body

  //check if email is register in database

  const user=await User.findOne({email})
  if(!user){
    return res.status(403).json({error:'email does not match, register first'})
  }
  //check the password for that email
  if(!user.authenticate(password)){
    return res.status(400).json({error:'email and password does not match'})
  }
  //check if user is verified or not
  if(!user.isVerified){
    return res.status(400).json({error:'please verify your email to continue'})
  }
  //now generate token with user id and jwt secret
  const token=jwt.sign({_id:user.id,role:user.role},process.env.JWT_SECRET)

  //store token in the cookie
  res.cookie('myCookie',token,{expire:Date.now()+999999})

  //return user information to frontend
  const{_id,username,role}=user 
  return res.json({token,user:{_id,username,email,role}})
}

//forget password 

exports.forgetPassword=async(req,res)=>{
  const user=await User.findOne({emai:req.body.email})
  if(!user){
    return res.status(400).json({error:'unable to find this email, try another'})
  }
  let token=new Token({
    userId:user._id,
    token:crypto.randomBytes(16).toString
  })
  token=await token.save()
  if(!token){
    return res.status(400).json({error:'failed to create a token'})
  }
  //password recent link
  sendEmail({
    from:'no-reply@online-store.com',
    to:newUser.email,
    subject:'password reset link',
    text:`hello ,\n\n please verify your email by using below link \n\n 
    http:\/\/${req.headers.host}\/api\/reset\/password\/${token.token}`,
    html:`<h1> reset your password</h1>`
  })
  res.json({msg:'password reset link has been sent to your email'})
}


//reset password
exports.resetPassword=async(req,res)=>{
  //at first find the valid token
  let token=await Token.findOne({token:req.params.token})
  if(!token){
    return res.status(400).json({error:'failed to create a token'})
  }
  //if token found then find the valid user for that token
  let user=await User.findOne({_id:token.userId})
  if(!user){
    return res.status(400).json({error:'we are unable to find valid user for this token'})
  }
  user.password=req.body.password
  user=await user.save()
  if(!user){
    return res.status(400).json({error:'failed to reset password'})
  }
  res.json({msg:'password has been reset successfully'})
}








exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    .select('-hashed-password')
    .select('-salt')
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

// Update a user's information
exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.role && !['employee', 'admin'].includes(updates.role)) {
      return res.status(400).json({ message: "Invalid role provided" })
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User updated successfully", updatedUser })
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error })
  }
}

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json({ message: "User deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error })
  }
};


//middleware for user role

exports.requireUser=(req,res,next)=>{
    //verify jwt
    expressjwt({
      secret:process.env.JWT_SECRET,
      algorithms:['HS256'],
      requestProperty:'auth'
    })(req,res,(err)=>{
      if(err){
        return res.status(401).json({error:'unauthorized'})
      }
      //check for userrole
      if(req.auth.role==='employee'){
        //grant access
        next()
      }
      else{
        //unauthorized
        return res.status(403).json({error:'forbidden'})
      }
    })
}

//middleware for admin role

exports.requireAdmin=(req,res,next)=>{
  //verify jwt
  expressjwt({
    secret:process.env.JWT_SECRET,
    algorithms:['HS256'],
    requestProperty:'auth'
  })(req,res,(err)=>{
    if(err){
      return res.status(401).json({error:'unauthorized'})
    }
    //check for userrole
    if(req.auth.role==='admin'){
      //grant access
      next()
    }
    else{
      //unauthorized
      return res.status(403).json({error:'forbidden'})
    }
  })
}

exports.getUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // Assuming `req.user` contains the authenticated user ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json({ isRegistered: user.isRegistered || false })
  } catch (error) {
    console.error('Error fetching user status', error)
    res.status(500).json({ message: 'Server error' })
  }
}
