const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const jsonParser = bodyParser.json();
const Product = require('../models/product');
const checkAuth = require('../middleware/check-authentication');
const productController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
    // fileSize:function(req,file,cb){
    //     cb(null,file.fieldSize	)
    // }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || 'image/png' || 'image/jpg') {
        cb(null, true)
    }
    else {
        cb(null, false)
    }

}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/', jsonParser, productController.product_get_all);

router.get('/:rentID', jsonParser, productController.product_get_product);

router.post('/', checkAuth, upload.single('productImage'), jsonParser, productController.product_create_all);

router.post('/:rentID', checkAuth, jsonParser, productController.product_create_one);

router.patch('/:rentID', checkAuth, jsonParser, productController.product_patch_all);

router.delete('/:rentID', checkAuth, jsonParser, productController.product_delete_one)
module.exports = router;