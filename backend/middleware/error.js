const ErrorHandler = require('../utils/errorhander');

module.exports = (err,req,res,next) => {
    
    err.statusCode = err.statusCode || 500;
    err.message= err.message || 'Something went wrong';

    // wrong mongodb error
    if(err.name==="CastError"){
        const message = `resource not found. invalid ${err.path}`
        err = new ErrorHandler(message,400)
    }

    res.status(err.statusCode).json({
        success :false,
        message: err.message
    })
     
}