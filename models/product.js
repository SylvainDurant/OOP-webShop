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

});

module.exports = mongoose.model('Product',ProductSchema);