const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim:true
    },

    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    price:{
        type: Number,
        maxLength: [8, 'Price cannot exceed 8 characters'],
    },
    rating:{
        type: Number,
        default: 0,
    },
    images:[
        {
        public_id:{
            type: String,
            required: [true, 'Please add an image'],
        },
        url:{
            type: String,
            required: [true, 'Please add an image'],
        }
    }
    ],
    category: {
        type: String,
        required: [true, 'Please enter product category'], 
    },
    stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
        maxLength: [4, 'Stock cannot exceed 4 characters'],
        default: 1,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews:[
        {
            name:{
                type: String,
                required: [true, 'Please add a name'],
            },
            rating:{
                type: Number,
                required: [true, 'Please add a rating'],
            },
            comment:{
                type: String,
                required: [true, 'Please add a comment'],
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('Product',productSchema)