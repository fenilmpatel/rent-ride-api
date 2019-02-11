const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Order = require('../models/order');
const Product = require('../models/product')
const checkAuth = require('../middleware/check-authentication')
const orderController = require('../controllers/orders')
router.get('/', checkAuth, jsonParser, orderController.orders_get_all);
router.get('/:productId', checkAuth, jsonParser, orderController.orders_get_order)
router.post('/', checkAuth, jsonParser, orderController.orders_create_all);
router.delete('/:orderid', checkAuth, jsonParser, orderController.orders_delete_all);
router.patch('/:productId', checkAuth, jsonParser, orderController.orders_patch_all)

module.exports = router;