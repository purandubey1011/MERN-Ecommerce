const ErrorHandler = require('../utils/errorhander')
const catchAsyncErrors = require('../middleware/catchAsyncError') // to catch errors in async functions
const User = require('../models/userModel')

exports.registerUser = catchAsyncErrors(async(req,res,next)=>{

    const { name,  email, password} = req.body
    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"this is a sample id",
            url:"profilePictureUrl"
        }
    });

    res.status(201).json({
        success:true,
        user 
    })
})