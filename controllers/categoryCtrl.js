const { find } = require('../models/categoryModel')
const Category = require('../models/categoryModel')
const Product = require('../models/productModel')

const categoryCtrl = {

    getCategories: async (req, res) => {
        try{
            const categories = await Category.find()
            res.json(categories)

        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    createCategory: async (req, res) => {
        try{
            //role 1 ---> admin
            //onlyAdmin can create, update and delete category
            const {name} = req.body;
            const category = await Category.findOne({name})
            if(category){
                return res.status(400).json({msg: "This category already exists."})
            }
            const newCategory = new Category({name})
            await newCategory.save()
            res.json({msg: "Created Successfully"})



        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    deleteCategory: async (req, res) => {
        try{
            const products = await Product.findOne({category: req.params.id})
            if(products) return res.status(400).json({msg: "Please delete products under this category"})
            await Category.findByIdAndDelete(req.params.id)

            res.json({msg: "Category Deleted successfully"})

        }catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateCategory: async (req, res) => {
        try{
            const {name} = req.body
            await Category.findByIdAndUpdate(req.params.id, {$set: {name: name}})
            

            res.json({msg: "Category Updated successfully"})

        }catch(err) {
            return res.status(500).json({msg: err.message})
        }
    }

}

module.exports = categoryCtrl