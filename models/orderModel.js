const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderId: { type: String, required: true, unique: true },
    details: { type: Object, required: true }
});

module.exports = mongoose.model('Order', orderSchema);
