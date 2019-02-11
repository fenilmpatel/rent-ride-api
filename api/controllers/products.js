const mongoose = require('mongoose');
const Product = require('../models/product');


exports.product_get_all = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                product: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:4000/products/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
}
exports.product_get_product = (req, res, next) => {
    const id = req.params.rentID;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json({
                name: doc.name,
                price: doc.price,
                _id: doc._id,
                productImage: doc.productImage,
                url: {
                    method: 'get',
                    url: 'http://localhost:4000/products/' + doc._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
}
exports.product_create_all = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product
        .save()
        .then((result) => {
            console.log(result);
            res.status(200).json({

                product: {
                    message: 'product created successfully',
                    name: result.name,
                    price: result.price,
                    productImage: result.productImage,
                    _id: result._id,
                    url: {
                        method: 'post',
                        url: 'http://localhost:4000/products/' + result._id
                    }
                }
            })
        })

        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}
exports.product_patch_all =(req, res, next) => {
    const id = req.params.rentID;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json(result);

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })
}
exports.product_delete_one=(req, res, next) => {
    const id = req.params.rentID;

    Product.remove({ _id:id})
        .exec()
        .then(result => {
            res.status(200).json(result);
            res.status(200).json({ message: 'updated rent services' });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })

}
exports.product_create_one=(req, res, next) => {
    const ID = req.params.rentID
    res.status(201).json({
        message: 'post request get successfully',
        id: ID
    });
    product
        .save()
        .then(result => { console.log(result) })
        .catch(err => { console.log(err) });

}