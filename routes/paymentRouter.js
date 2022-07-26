const paymentRouter = require('express').Router()
const paymentCtrl = require('../controllers/paymentCtrl')
const auth = require('../middleware/auth')
const {authAdmin} = require('../middleware/authAdmin')


paymentRouter.route('/checkout')
    .get(auth, authAdmin, paymentCtrl.getPayments)
    .post(auth, paymentCtrl.createPayment)

paymentRouter.delete('/clearNotifications', auth, authAdmin, paymentCtrl.clearNotifications)
// paymentRouter.route('/payment')
//     .get(auth, authAdmin, paymentCtrl.getPayments)
//     .post(auth, paymentCtrl.createPayment)


module.exports = paymentRouter