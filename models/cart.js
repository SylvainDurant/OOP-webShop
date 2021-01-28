const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema  = new mongoose.Schema({
    items :[{
        type: Schema.Types.ObjectId,
        ref: "Product"
    }]
});

module.exports = mongoose.model('Cart',CartSchema);