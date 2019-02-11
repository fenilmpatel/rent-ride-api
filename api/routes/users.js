const mongoose = require("mongoose");
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const User = require('../models/user');
const userController = require('../controllers/user')


router.post('/signup', jsonParser, userController.user_create_one)

router.post('/login', jsonParser, userController.user_login_one)

router.delete('/:userid', jsonParser, userController.user_delete_one)

router.get('/',jsonParser,userController.user_get_all)

module.exports = router;