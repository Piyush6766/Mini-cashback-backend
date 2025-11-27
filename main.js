const express = require('express');
const mongoose = require('mongoose');
const {User, Purchase, Cashback} = require('./model');


const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/cashbackApp')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/purchase', async (req, res) => {
    const { userId, store, amount } = req.body; 

    const purchase = await Purchase.create({ userId, store, amount });

    const cashbackAmount = amount * 0.1;

    const cashback = await Cashback.create({
        userId,
        PurchaseId: purchase._id,
        amount: cashbackAmount,
        status: 'pending'
    });

    purchase.cashbackId = cashback._id;
    await purchase.save();

    res.json({ purchase, cashback });
});

app.post('/cashback/approve/:id', async (req, res) => {
   const cb = await Cashback.findById(req.params.id);

   if (!cb) return res.status(404).send('Cashback not found');

   if(cb.status !== 'pending') {
       return res.status(400).send('Cashback already processed');
   }

    cb.status = 'approved';

    await cb.save();

    res.json(cb);


});

app.get('/cashback/user/:id', async (req, res) => {
    const cashbacks = await Cashback.find({ userId: req.params.id });
    res.json(cashbacks);
});


app.listen(3000)