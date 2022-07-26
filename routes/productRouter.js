const productRouter = require('express').Router();
const productCtrl = require('../controllers/productsCtrl')
const auth = require('../middleware/auth')
const {authAdmin, authAdmin2 } = require('../middleware/authAdmin')

productRouter.route('/products')
.get(productCtrl.getProducts)
.post(auth, authAdmin, productCtrl.createProduct)


productRouter.route('/vendor_products')
.get(auth,authAdmin2,async(req,res) =>{
    if(req.user.vendorName){
        return await productCtrl.getVendorProducts(req,res)
    }else{
        return await productCtrl.getProducts(req,res)
    }
})

productRouter.route('/products/:id')
.get(productCtrl.getProduct)
.put(productCtrl.updateProduct)
.delete(productCtrl.deleteProduct)

module.exports = productRouter;