const ErrorHandler = require('../utils/errorhander');
const catchAsyncError = require('./catchAsyncError');
const jwt = require('jsonwebtoken')
const User = require('../models/userModel');

exports.isAuthenticatedUser = catchAsyncError(async(req,res,Next)=>{
    const {token} = req.cookies;

    if(!token){
        return Next(new ErrorHandler("please login to access this page",401));
    }

    const decodedData = jwt.verify(token,process.env.JWT_SECRET);

    // if(!decodedData){
    //     return Next(new ErrorHandler("please login to access this page",401));
    // }

    req.user = await User.findById(decodedData.id)

    Next();

})

exports.authorizeRoles = (...roles) =>{
    return (req,res,Next)=>{
        if(!roles.includes(req.user.role)){
            return Next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`,403))
         }

        Next();
    };
};