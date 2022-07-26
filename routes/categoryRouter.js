const categoryRouter = require('express').Router()
const categoryCtrl = require('../controllers/categoryCtrl')
const auth = require('../middleware/auth')
const {authAdmin} = require('../middleware/authAdmin')

categoryRouter.route('/category')
.get(categoryCtrl.getCategories)
.post(auth, authAdmin, categoryCtrl.createCategory)

categoryRouter.route('/category/:id')
.delete(auth, authAdmin, categoryCtrl.deleteCategory)
.put(auth, authAdmin, categoryCtrl.updateCategory)

module.exports = categoryRouter;