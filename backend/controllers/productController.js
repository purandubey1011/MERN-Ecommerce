const Product = require('../models/productModels')
const ErrorHandler = require('../utils/errorhander')
const catchAsyncErrors = require('../middleware/catchAsyncError') // to catch errors in async functions
const ApiFeatures = require('../utils/apifeatures')


// create product -admin
exports.createProduct = catchAsyncErrors(
    async (req, res, next)=>{
        
        const product = await Product.create(req.body)
    
        res.status(201).json({
            success:true,
            product
        })
    }
)

// get all product
exports.getAllProducts = catchAsyncErrors(
    async(req,res) =>{
        const resultPerPage = 5;
        const productCount = await Product.countDocuments()      
        const apiFeature = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage)
        // const products =await Product.find()
        const products =await apiFeature.query
        res.status(200).json({
            success:true,
            products,
            productCount 
        })  // return all products
    
    }
)

// get product by id
exports.getProductDetails = catchAsyncErrors(
    async(req,res,next)=>{
        const product = await Product.findById(req.params.id)
    
        if(!product){
           return next(new ErrorHandler("product not found", 404) )
        }
        res.status(200).json({
            success:true,
            product
        })
    }
)


// update product 
exports.updateProduct = catchAsyncErrors(
    async(req,res,next) =>{
        let product = await Product.findById(req.params.id)
        if(!product){
            return next(new ErrorHandler("product not found", 404) )
        }
            
            product = await Product.findByIdAndUpdate(req.params.id, req.body,{
                new:true,
                runValidators:true,
                useFindAndModify:false
            })
            res.json({
                success:true,
                product
            })
        
    } 
)  

// delete product
exports.deleteProduct = catchAsyncErrors(
    async(req,res,next)=>{
        let product = await Product.findById(req.params.id)
        if(!product){
            return next(new ErrorHandler("product not found", 404) )
        }
        await product.remove()
    
        res.status(200).json({
            success:true,
            message:"product deleted"
        })
    }
)

