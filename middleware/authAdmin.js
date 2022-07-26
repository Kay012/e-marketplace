const User = require('../models/userModel')
const VendorUser = require('../models/vendorUserModel')

const authAdmin =  async (req, res, next) => {
    try{

        const userAdmin = await User.findOne({_id: req.user.id}) || await VendorUser.findOne({_id: req.user.id})
        if(userAdmin.role == 0) {
            res.status(401).json({msg: "Access to admin resourcres denied"})
        }
        // console.log(userAdmin);
        req.user = {...req.user, vendorName:userAdmin.vendorName}
        return next();
    }catch(err){
        return res.status(500).json({msg: err.message})
    }
}

const authAdmin2 =  async (req, res, next) => {
    try{

        const userAdmin = await User.findOne({_id: req.user.id}) || await VendorUser.findOne({_id: req.user.id})
        if(userAdmin.role == 0) {
            // console.log(req.user);
            // res.status(401).json({msg: "Access to admin resourcres denied"})
            // req.user = req.user;
            return next();
        }
        
        req.user = {...req.user, vendorName:userAdmin.vendorName}
        return next();
    }catch(err){
        return res.status(500).json({msg: err.message})
    }
}
 
module.exports = {authAdmin, authAdmin2}