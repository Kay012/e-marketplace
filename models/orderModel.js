const mongoose = require('mongoose')



const orderItemSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    }, 
    productId:{
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
    vendorId:{
        type: String,
        required:true
    },
    price:{
        type:Number,
        default:0
    },
    imageUrl:{
        type:String
    }
})


const orderSchema = new mongoose.Schema({
    items:[orderItemSchema],
    vendors:{
        type: Array,
        default: []
    },
    // quantity:{
    //     type:Number,
    //     default:1
    // },
    // total:{
    //     type:Number,
    //     default:0
    // },
    customerName:{
        type: String
    },
    customerId:{
        type: String,
        required:true
    },
    // customerContact:{
    //     type:Number
    // },
    customerEmail:{
        type: String
    },
    deliveryAddress:{
        type: String,
        default: "Campus Africa, 3 Nugget St Hilbrow, Johannesburg, 2001"
    }
},{
    timestamps:true
})



module.exports = mongoose.model('Order', orderSchema)