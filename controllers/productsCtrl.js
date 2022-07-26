const Product = require('../models/productModel')

//Filter, Sort, Pagination

class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filtering(){
        const queryObj = {...this.queryString} // queryString = req.query
        const excludeField = ['page', 'sort', 'limit']
        excludeField.forEach(el => delete(queryObj[el]))
    

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

        // gte => >=, gt => >, lt => <, lte => <=, regex => contains string/character, g => global search

        this.query.find(JSON.parse(queryStr))

        return this

    }


    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('-createdAt')
        }
        
        
        return this;
    }


    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 6//number of items to display
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this
    }
}


const productsCtrl= {
    getProducts: async (req, res) => {
        try{
            const features = new APIfeatures(Product.find(), req.query).filtering().sorting().paginating()
            const products = await features.query;
            return res.json({status: 'success', result: products.length, products: products})

        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    getVendorProducts: async (req, res) => {
        try{
            const features = new APIfeatures(Product.find({"createdBy.vendorId":`${req.user.id}`}), req.query).filtering().sorting().paginating()
            const products = await features.query;
            return res.json({status: 'success', result: products.length, products: products})
            // return products
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    }
    ,
    createProduct : async (req, res) => {
        try{
            const { title, price, description, content, images, otherImages, category} = req.body;
            if(!images || !otherImages) {
                return res.status(400).json({msg:"No image upload"})
            }
            // const product = await Product.findOne({product_id})
             
            // if(product) return res.status(400).json({msg: "Product already exists"})

            const newProduct = new Product({
                title: title.toLowerCase(), price, description, content, images, otherImages, category, createdBy:{
                    vendorId:req.user.id,
                    vendorName:req.user.vendorName
                }
            })
            await newProduct.save()
            res.json({msg:"Created product"})
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    deleteProduct : async (req, res) => {
        try{
            await Product.findByIdAndDelete(req.params.id)

            res.json({msg: "Deleted successfully"})

        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    }, 
    updateProduct : async (req, res) => {
        try{
            const { title, price, description, content, images, category} = req.body;
            if(!images) {
                return res.status(400).json({msg:"No image upload"})
            }
            await Product.findByIdAndUpdate(req.params.id, {$set: req.body})
            res.json({msg: "Updated Successfully", })

        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    getProduct : async (req, res) => {
        try{
            const product = await Product.findById(req.params.id)
            res.json(product)
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },

}

module.exports = productsCtrl