const ErrorHandler = require('../utils/errorhander')
const catchAsyncErrors = require('../middleware/catchAsyncError') // to catch errors in async functions
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');

exports.registerUser = catchAsyncErrors(async(req,res,next)=>{

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
exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
    const {email,password}= req.body

    // checking if user has given pass and email both

    if(!email || !password){
        return next(new ErrorHandler("please enter email & password",400));
    }

    const user =await User.findOne({email}).select("+password")

    if(!user){
       return next(new ErrorHandler("invalid emmail and password",401))
    }

    const isPasswordMatched =await user.comparePassword(password)

    if(!isPasswordMatched){
      return next(new ErrorHandler("invalid emmail and password",401))
    }

   sendToken(user,200,res)
})