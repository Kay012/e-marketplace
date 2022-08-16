const User = require('../models/userModel')
const  VendorUser = require('../models/vendorUserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Order = require('../models/orderModel')


const userCtrl = {
    register: async (req, res) => {
        try {
            const {username, email, password} = req.body;
            const user = await User.findOne({email})
            if (user) {
                return res.status(400).json({msg: 'This email already exists.'})
            }
            if (password.length < 6) {
                return res.status(400).json({msg: "Password should be atleast 6 characters long"})
            }
            // password Encryption
            const passwordHash = await bcrypt.hash(password, 10)

            const newUser = new User({
                username, email, password: passwordHash
            })

            //save to mongodb
            await newUser.save()
            // res.json({msg: "Registered successfully!"})

            //Then create jsonwebtoken to for authentication
            const accesstoken = createAccessToken({id:newUser.email._id})
            const refreshtoken = createRefreshToken({id:newUser.email._id})

            res.cookie('refreshtoken', refreshtoken, {
                // httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000, // 7d
                sameSite:'none',
                secure:true,
            })
            res.json({accesstoken, newUser})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    registerVendor: async (req, res) => {
        try {
            const {vendorName, contact, email, password} = req.body;
            const user = await VendorUser.findOne({email})
            if (user) {
                return res.status(400).json({msg: 'This email already exists.'})
            }
            if (password.length < 6) {
                return res.status(400).json({msg: "Password should be atleast 6 characters long"})
            }
            // password Encryption
            const passwordHash = await bcrypt.hash(password, 10)

            const newVendorUser = new VendorUser({
                vendorName, email, contact, password: passwordHash
            })

            //save to mongodb
            await newVendorUser.save()
            // res.json({msg: "Registered successfully!"})

            //Then create jsonwebtoken to for authentication
            const accesstoken = createAccessToken({id:newVendorUser.email._id})
            const refreshtoken = createRefreshToken({id:newVendorUser.email._id})

            res.cookie('refreshtoken', refreshtoken, {
                // httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000, // 7d
                sameSite:'none',
                secure:true
                
            })
            res.json({accesstoken, newVendorUser})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async (req, res) => {

        try {
            const {email, password} = req.body;

            const user =  await User.findOne({email}) || await VendorUser.findOne({email});
            if(!user) {
                return res.status(400).json({msg: "User does not exist"})
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) {
                return res.status(400).json({msg: "Incorrect password"})               
            }

            //if login successfu create access token and refresh access token
            const accesstoken = createAccessToken({id: user._id});
            const refreshtoken = createRefreshToken({id:user._id})

            res.cookie('refreshtoken', refreshtoken, {
                // httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000, // 7d
                sameSite:'none',
                secure:true
            })
            res.json({accesstoken})
            // res.json({msg: "Login successful"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    logout: async(req, res) => {
        try {
            res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
            res.json({msg: "Logged out"})

        }catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    refreshToken: (req, res) => {
        try {

            const rf_token = req.cookies.refreshtoken;
            if(!rf_token) {
                return res.status(400).json({msg: "Please Login or Register"})
            }
            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if(err) {
                    return res.status(400).json({msg: "Please Login or Register"})
                }
                const accesstoken = createAccessToken({id:user.id})
                res.json({user, accesstoken})
            })
            //res.json({rf_token}) 
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
            
        }

    },
    getUser: async (req, res) => {
        try{

            //get user infor by Id
            const user = await User.findById(req.user.id).select('-password') || await VendorUser.findById(req.user.id).select('-password')
            if(!user) {
                return res.status(401).json({msg: "User does not exist"})
            }
            res.json(user)

        }catch(err){
            return res.status(500).json({msg: err.message})
        }  
    },
    addCart: async(req, res) => {
        try{

            const user = await User.findById(req.user.id)
            
            if(!user) return res.status(400).json({msg: "User does not exist"})
            await User.findOneAndUpdate({_id: req.user.id}, {cart: req.body.cart})
            return res.json("Added to cart")

        }catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    history: async(req, res) => {
        
        try{
            const history = await Order.find({customerId: req.user.id})
            return res.json(history)
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    history2: async(req, res) => {
        try{
            const history = await Order.find({vendors:{$elemMatch:{vendor: req.user.id}}})
            return res.json(history)
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    }
}
const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '11m'})
}
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}
module.exports = userCtrl