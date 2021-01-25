const mongoose = require('mongoose');

const ProductSchema  = new mongoose.Schema({
    name :{
        type  : String,
        required : true
    },

    img :{
        type  : String,
        required : true
    },

    price :{
        type  : Number,
        required : true
    },

    category :{
        type  : String,
        required : true
    },

    discount :{
        type  : Boolean,
        default : false
    },

    date :{
        type : Date,
        default : Date.now
    },

    quantity :{
        type : Number,
        required : true
    },

    sold :{
        type : Number,
        default : 0
    }
});

module.exports = mongoose.model('Product',ProductSchema);