const mongoose = require('mongoose')
const vendorUserSchema = new mongoose.Schema({
    vendorName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 1
    },
    notifications:{
        type:Array,
        default:[]
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('VendorUser', vendorUserSchema)