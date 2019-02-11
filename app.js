const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://'+ process.env.MONGO_ATLAS_PW +':rent-ride-api@cluster0-shard-00-00-jdona.mongodb.net:27017,cluster0-shard-00-01-jdona.mongodb.net:27017,cluster0-shard-00-02-jdona.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true').then(() => console.log('MongoDB Connected.')).catch(err => console.log(err));;
// mongoose.connect('mongodb://localhost:27017/rent-ride-api');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users')

app.use(morgan('dev'));

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users',userRoutes);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-origin", '*');
    res.header("Access-Control-Allow-header", "origin,X-Requested-With,Content-Type,Accept,Authorization");
    if (req.method = 'options') {
        res.header("Access-Control-Allow-Methos", 'GET,PUT,POST,PATCH,DELETE');
        return res.status(200).json();}
});

app.use((req, res, next) => {
    const error = new Error('not found')
    error.status = 404;
    next(error)});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;  