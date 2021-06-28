const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;

const expense = Schema({
    _id: objectId,
    type: { type:String, required: true },
    date: { type:Date, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    memo: String
});

module.exports = mongoose.model('Expense', expense);