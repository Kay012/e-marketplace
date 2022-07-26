const userRouter = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')
const {authAdmin2} = require('../middleware/authAdmin')


userRouter.post('/register', userCtrl.register)
userRouter.post('/register_vendor', userCtrl.registerVendor)
userRouter.post('/login', userCtrl.login)
userRouter.get('/logout', userCtrl.logout)
userRouter.get('/refresh_token', userCtrl.refreshToken)
userRouter.get('/logout', userCtrl.logout)
userRouter.get('/infor', auth, userCtrl.getUser)
userRouter.patch('/addcart', auth, userCtrl.addCart)
userRouter.get('/history', auth, authAdmin2, async(req,res) => {
    if(req.user.vendorName){
        return await userCtrl.history2(req,res)
    }else{
        return await userCtrl.history(req,res)
    }
}) 



module.exports = userRouter