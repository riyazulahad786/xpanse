const { request } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
// Include models
const Expense = require('../models/expense');

// get all expenses
router.get('/', function (req, res, next) {
    Expense.find()
        .select('-__v')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                expenses: docs.map(doc => {
                    return {
                        expense: doc,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/expense/" + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response); 
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
})

// get an expense
router.get('/:expenseId', function (req, res, next) {
    const id = req.params.expenseId;
    Expense.findById(id)
        .select('-__v')
        .exec()
        .then(doc => {
            res.status(200).json({
                expense: doc,
                request: {
                    type: "GET",
                    decription: "Get all products",
                    url: "http://localhost:3000/expense"
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
})

// create an expense
router.post('/add', function (req, res, next) {
    const expense = new Expense({
        _id: new mongoose.Types.ObjectId(),
        type: req.body.type,
        date: req.body.date,
        amount: req.body.amount,
        category: req.body.category,
        memo: req.body.memo
    });
    expense
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Created an expense successfully',
                createExpense: {
                    type: result.type,
                    date: result.date,
                    amount: result.amount,
                    category: result.category,
                    memo: result.memo,
                    _id: result._id
                },
                request: {
                    type: "GET",
                    url: "http://localhost:3000/expense/" + result._id
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
})

// edit an expense
router.patch('/edit/:expenseId', function (req, res, next) {
    const id = req.params.expenseId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
        console.log(updateOps);
    };
    
    Expense.updateMany({_id: id}, {$set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                messgae: 'Expense updated successfully',
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/expense/" + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
})

// delete an expense
router.delete('/delete/:expenseId', function (req, res, next) {
    const id = req.params.expenseId;
    Expense.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                messgae: 'Expense deleted successfully',
                request: {
                    type: 'POST',
                    url: "http://localhost:3000/expense/add/",
                    body: { type: 'String', date: 'Date', amount: 'Number', category: 'String', memo: 'String'}
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
})

module.exports = router;
