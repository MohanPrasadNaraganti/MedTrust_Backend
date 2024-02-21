const Order = require('../models/orderModel');

async function createOrder(req, res) {
    try {
        const { orderId, details } = req.body;
        const newOrder = await Order.create({ orderId, details });
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get all orders
async function getAllOrders(req, res) {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get order by orderId
async function getOrderById(req, res) {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findOne({ orderId });
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Update order details by orderId
async function updateOrder(req, res) {
    try {
        const orderId = req.params.orderId;
        const { details } = req.body;

        const updatedOrder = await Order.findOneAndUpdate(
            { orderId },
            { $set: { details } },
            { new: true }
        );
        
        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Delete order by orderId
async function deleteOrder(req, res) {
    try {
        const orderId = req.params.orderId;
        const deletedOrder = await Order.findOneAndDelete({ orderId });

        if (!deletedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder
};
