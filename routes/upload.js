const uploadRouter = require('express').Router()
const cloudinary = require('cloudinary')
const auth = require('../middleware/auth')
const {authAdmin} = require('../middleware/authAdmin')
const fs = require('fs')
//uploading images to cloudinary

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

//upload image only admin
uploadRouter.post('/upload', auth, authAdmin, (req, res) => {
    try{
       
        if(!req.files || Object.keys(req.files).length ===0){
            return res.status(400).json({msg:'No files were uploaded'})
        }
        const file = req.files.file;
        if( file.size > 1024 * 1024 * 6) // 1024 * 1024 = 1mb or 1024 * 1024 *6 = 6mb
        {
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: 'File size too large'})
        }
        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: 'File format is incorrect.'})
        }
        
        cloudinary.v2.uploader.upload(file.tempFilePath, {folder: `marketplace/${req.user.id}`}, async(err, result) => {
            if(err){
                throw(err)
            }
            removeTmp(file.tempFilePath)
            return res.json({public_id: result.public_id, url: result.secure_url})
        })
        // cloudinary.v2.uploader.upload(file.tempFilePath, {folder: "test"}, async(err, result) => {
        //     if(err){
        //         throw(err)
        //     }
        //     removeTmp(file.tempFilePath)
        //     res.json({public_id: result.public_id, url: result.secure_url})
        // })
        // res.json('test upload')
    }catch(err) {
        return res.status(500).json({msg: err.message})
    }
})

//upload otherImages


//Delete image only admin
uploadRouter.post('/destroy', auth, authAdmin, (req, res) => {

    try{
        const {public_id} = req.body;
        if(!public_id) {
            return res.status(400).json({msg: ''})
        }
        cloudinary.v2.uploader.destroy(public_id, async(err, result) => {
            if(err){
                console.log("first err",err)
                throw err
            }

            return res.json({msg: "Image Deleted"})
        })

    }catch(err) {
        console.log("last err",err)
        return res.status(500).json({msg: err.message})
    }
})

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if(err) throw err
    })
}

module.exports = uploadRouter