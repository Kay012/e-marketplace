const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    quantity:{
        type: Number,
        default:1
    },
    vendorName:{
        type: String,
        required:true
    },
    total:{
        type:Number,
        default:0
    }
})

module.exports = mongoose.model('OrderItem', orderItemSchema);