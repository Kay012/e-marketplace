const order = require('../models/orderModel')
const Payment = require('../models/paymentModel')
const User = require('../models/userModel')
const VendorUser = require('../models/vendorUserModel')
const Product = require('../models/productModel')



const paymentCtrl = {
    getPayments: async(req, res) =>{
        try {
            const payments = await Payments.find()
            res.json(payments)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createPayment: async(req, res) => {
        try {
            let orderItems = [];
            const user = await User.findById(req.user.id).select("username email")
            if(!user) return res.status(400).json({msg: "User does not exist."})

            const {cart, total, totalQuantity} = req.body;

            const {_id, username, email} = user;
            

            // const newPayment = new Payment({
            //     user_id: _id, username, email, cart, paymentID, address
            // })
            let vendors = [];
            let sendVendors = []
            cart.forEach((item) => {
                // const vendor = await VendorUser.find({vendorName:item.vendorName})
                // if(!vendor) return res.status(404).json({msg:"Vendor does not Exist"})
                const newOrderItem ={
                    title:item.title,
                    imageUrl:item.images.url,
                    productId:item._id,
                    price:item.price,
                    quantity: item.quantity,
                    vendorName:item.createdBy.vendorName,
                    vendorId:item.createdBy.vendorId
                }
                orderItems.push(newOrderItem)

                
                vendors.includes({vendor: item.createdBy.vendorId})? pass : vendors.push({vendor: item.createdBy.vendorId, isShipped:false})
                sendVendors.includes(item.createdBy.vendorId)? pass : sendVendors.push(item.createdBy.vendorId)
            })
            
            const newOrder = new order({
                items:orderItems,
                customerId:req.user.id,
                customerName:username,
                customerEmail:email,
                vendors
                // total,
                // quantity:totalQuantity
            })
            const saveOrder = await newOrder.save()
            vendors.forEach(async (vendor) => {
                await VendorUser.updateOne({_id:vendor.vendor}, {$push:{notifications:saveOrder._id}}, {upsert:true})
            })
            cart.filter(item => {
                return sold(item._id, item.quantity, item.sold)
            })

            
            // await newPayment.save()
            res.json({msg: "Order Success!", sendVendors})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    clearNotifications: async(req, res)=>{
        try{
            await VendorUser.updateOne({_id:req.user.id}, {$set:{notifications:[]}}, {upsert:true})
            return res.json({msg: "Order Success!"})
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
      
    }
}
    // createPayment: async(req, res) => {
    //     try {
    //         const user = await User.findById(req.user.id).select('name email')
    //         if(!user) return res.status(400).json({msg: "User does not exist."})

    //         const {cart, paymentID, address} = req.body;

    //         const {_id, name, email} = user;

    //         const newPayment = new Payment({
    //             user_id: _id, name, email, cart, paymentID, address
    //         })

    //         cart.filter(item => {
    //             return sold(item._id, item.quantity, item.sold)
    //         })

            
    //         await newPayment.save()
    //         res.json({msg: "Payment Succes!"})
            
    //     } catch (err) {
    //         return res.status(500).json({msg: err.message})
    //     }
    // }
// }

const sold = async (id, quantity, oldSold) =>{
    await Product.findOneAndUpdate({_id: id}, {
        sold: quantity + oldSold
    })
}

module.exports = paymentCtrl