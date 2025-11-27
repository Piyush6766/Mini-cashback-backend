const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
    name: String,
    email: String
}));

const Purchase = mongoose.model('Purchase', new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId },
    amount: Number,
    store: String,
    cashbackId: mongoose.Types.ObjectId
    
}));

const Cashback = mongoose.model('Cashback', new mongoose.Schema({
    userId: mongoose.Types.ObjectId,
    PurchaseId: mongoose.Types.ObjectId,
    amount: Number,
    status: { type: String,  default: 'pending' }
}));

module.exports={User, Purchase, Cashback};