const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please enter your name'],
        maxLength:[30,"name cannot exceed 30 characters"],
        minLength:[4, 'name should have more than 4 charaters']
    },
    email:{
        type: String,
        required: [true,'please enter your email'],
        unique:true,
        validate:[validator.isEmail,"please enter valid email"]
    },
    password:{
        type: String,
        required: [true,'please enter your password'],
        minLength:[8, 'name should be greater than 8 charaters'],
        select: false
    },
    avatar:{
        public_id:{
            type: String,
            required: [true, 'Please add an image'],
        },
        url:{
            type: String,
            required: [true, 'Please add an image'],
        }
    },
    role: {
        type : String,
        default: "user",

    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

})

userSchema.pre("save",async function(){

    if(!this.isModified('password')){
        next()
    }

    this.password =await bcrypt.hash(this.password,10)
})

module.exports= mongoose.model("User", userSchema)