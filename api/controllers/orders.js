const mongoose = require('mongoose');
const Order = require('../models/order')
const Product = require('../models/product')


exports.orders_get_all = (req, res, next) => {
    Order.find()
        .populate('product')
        .then((docs) => {
            const response = {
                count: docs.length,
                product: docs.map(doc => {
                    return {
                        product: doc.product,
                        quantity: doc.quantity,
                        _id: doc._id,
                        url: {
                            method: 'GET',
                            url: 'http://localhost:4000/orders/' + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })
}

exports.orders_create_all = (req, res, next) => {
    Product.findById(req.body.productid)
        .exec()
        .then(product => {
            if (!product) {
                return res.status(404).json({ message: 'product not found' })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: req.body.productid,
                quantity: req.body.quantity
            })


            return order
                .save()
                .then(result => {
                    console.log(result)
                    res.status(201).json({
                        product: {
                            quantity: result.quantity,
                            product: result.product,
                            _id: result._id,
                            url: {
                                method: 'post',
                                url: 'http://localhost:4000/orders/' + result._id
                            }
                        }
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: err })
                })
        })

}
exports.orders_get_order = (req, res, next) => {
    const id = req.params.productId;
    Order.findById(id)
        .populate('product', 'name')
        .select('product quantity')
        .then(order => {
            if (!order) {
                res.status(404).json({
                    message: 'order not found'
                })
            }
            res.status(200).json({
                order: order,
                url: {
                    method: 'get',
                    url: 'http://localhost:4000/orders/'
                }
            })
        })

        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })
}
exports.orders_delete_all = (req, res, next) => {

    Order.remove({ _id: req.params.orderid })
        .exec()
        .then(order => {
            res.status(200).json({
                message: 'order remove sucessfully',
                url: {
                    method: 'POST',
                    url: 'http://localhost:4000/orders/'
                },
                body: { productId: 'id', quantity: 'Number' },
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}
exports.orders_patch_all = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Order.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })

}