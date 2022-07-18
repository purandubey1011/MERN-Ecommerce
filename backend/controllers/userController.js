const ErrorHandler = require('../utils/errorhander')
const catchAsyncErrors = require('../middleware/catchAsyncError') // to catch errors in async functions
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto')

exports.registerUser = catchAsyncErrors(async(req,res,Next)=>{

    const { name,  email, password} = req.body
    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"this is a sample id",
            url:"profilePictureUrl"
        }
    });
    
    sendToken(user,201,res)
}); 

// login user 
exports.loginUser = catchAsyncErrors(async(req,res,Next)=>{
    const {email,password}= req.body

    // checking if user has given pass and email both
 
    if(!email || !password){
        return Next(new ErrorHandler("please enter email & password",400));
    }

    const user =await User.findOne({email}).select("+password")

    if(!user){
       return Next(new ErrorHandler("invalid emmail and password",401))
    }

    const isPasswordMatched =await user.comparePassword(password)

    if(!isPasswordMatched){
      return Next(new ErrorHandler("invalid emmail and password",401))
    }

   sendToken(user,200,res)
})

// logged out user

exports.logout = catchAsyncErrors(async(req,res)=>{
  res.cookie("token",null,{
    expires:new Date(Date.now()),
    httpOnly:true
  })

    res.status(200).json({
        // status:"success",
        success :true,
        message:"logged out"
    })
})

// forgot Password
exports.forgotPassword = catchAsyncErrors(async(req ,res ,Next)=>{
  const user =await User.findOne({email:req.body.email})  // finding user by email

  if(!user){
    return await Next(new ErrorHandler("user not found",404 )) // if user not found
  }

  // get resetpassword token
  const resetToken = user.getResetPasswordToken() // get resetpassword token

  await user.save({validateBeforeSave:false}) // saving user with resetToken

  const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`
  
  const message = `your password reset token is :- 
    ${resetPasswordUrl}   
     and if you have not requested this email then please ignore it`;

  try {

    await sendEmail({
      email: user.email,
      subject : `Ecommerce password recovery`, 
      message,
    })  

    res.status(200).json({
      success: true ,
      message: `send email to ${user.email} successfully`
    })
    
  } 
  catch(err) {
    this.resetPasswordToken = undefined; // to remove token from user
    this.resetPasswordExpire = undefined;  // to remove token from user

    await user.save({validateBeforeSave:false}); // to reset the token and expire

    return await Next(new ErrorHandler(err.message,500)); // to send error to error handler
    
  }; 
 
}) // end of forgotPassword

// reset password
exports.resetPassword = catchAsyncErrors(async(req ,res ,Next)=>{

  // creating the hash token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token) 
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire : {$gt:Date.now()}
  })

  if(!user){
    return await Next(new ErrorHandler("reset password token invalid or has been expired",404 )) // if user not found
  }

  if(req.body.password !== req.body.confirmPassword){
    return Next(new ErrorHandler("Password does not match",404))
  }

  user.password = req.body.password;
  this.resetPasswordToken = undefined; // to remove token from user
  this.resetPasswordExpire = undefined;  // to remove token from user

  await user.save()
  sendToken(user,200,res)

})
