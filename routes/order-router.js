const router = require('express').Router()


const {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder
} = require('../controllers/orderCtrl'); // Assuming orderCtrl contains your order controller functions

router.route('/orders')
    .post(createOrder) // Create a new order
    .get(getAllOrders); // Get all orders

router.route('/orders/:orderId')
    .get(getOrderById) // Get order by orderId
    .put(updateOrder) // Update order details by orderId
    .delete(deleteOrder); // Delete order by orderId

module.exports = router;
