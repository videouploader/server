require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/user')

module.exports = function (req,res, next) {
    if(req.headers.hasOwnProperty('token')) {
        console.log("Masuk verifikasi JWT", req.headers.hasOwnProperty('token'))
        try {
            console.log("Cek ENV", process.env.SECRETKEY)
            const decoded = jwt.verify(req.headers.token, process.env.SECRETKEY)
            console.log("Hasil verifikasi JWT", decoded)
            if (decoded != null) {
                User.findOne({
                    email: decoded.email
                })
                .then(user => {
                    req.loggedInUser = user
                    next()
                })
            }
        } catch (err) {
            res.status(400).json({
                message: 'Invalid Token'
            })
        }
    } else {
        res.status(400).json({
            message: 'Please provide token'
        })
    }
}