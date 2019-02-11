const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.user_create_one = (req, res, next) => {

    User.find({ username: req.body.username })
        .exec()
        .then(user => {
            if (user >= 1) {
                res.status(409).json({
                    message: 'username  already  exists'
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })


    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            res.status(500).json({
                error: err
            })
        } else {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                username: req.body.username,
                password: hash
            })

            user
                .save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: 'User Created Sucessfully'
                    })
                })

                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: err })
                })


        }
    })


}
exports.user_login_one = (req, res, next) => {
    User.find({
        email: req.body.email
    })
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'authorization failed'
                })
            }

            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'authorization failed'
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userid: user[0]._id
                         }, process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        })
                    return res.status(200).json({
                        message: 'Login successfully',
                        token: token
                    })
                } else {
                    return res.status(401).json({
                        message: 'authorization failed'
                    })
                }
            })
        })
       .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })})
        }
exports.user_delete_one = (req, res, next) => {
    User.remove({ _id: req.params.userid })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'user deleted successfully'
            })
        })

        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })

}
exports.user_get_all =(req,res,next)=>{
    User.find()
    .then((docs) => {
        const response = {
            count: docs.length,
            product: docs.map(doc => {
                return {
                    email: doc.email,
                    _id: doc._id,
                    url: {
                        method: 'GET',
                        url: 'http://localhost:4000/users/' + doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err })
    })}