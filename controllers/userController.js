// User Controller for Video Upload
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwtConvert = require('../helpers/jwtConvert')

class UserController {
    static findAll (req,res) {
        console.log("masuk ke finduser")
        User
            .find({})
            // .populate('Videolist')
            .then(result => {
                res.status(200).json(result)
            })
            .catch (err => {
                res.status(500).json({
                    message: "Internal server error"
                })
            })
    }

    static register (req,res) {
        console.log("Masuk ke register", req.body)
        User
        .findOne({
            email: req.body.email
        })
        .then (user => {
            if(!user) {
                User
                .create({
                    email: req.body.email,
                    password: req.body.password
                })
                .then(newUser => {
                    console.log("New user created", newUser)
                    res.status(201).json({
                        message: `201: ${newUser}`
                    })
                })
                .catch (err => {
                    res.status(500).json({
                        message: "Internal server error"
                    })
                })
            } else {
                res.status(400).json({
                    message: 'Email has been registered'
                })
            } 
        })
        
    }

    static login (req, res) {
    console.log("Masuk ke login via website, input:", req.body)
    User
        .findOne({
            email: req.body.email
        })
        .then(user => {
            if(!user) {
                res.status(400).json({
                    message: `Wrong Email/Password`
                })
            } else {
                console.log("User berhasil ditemukan ====>", user)
                let isValid = bcrypt.compareSync(req.body.password, user.password)
                console.log("Cek validity==>", isValid)
                if(isValid) {
                    let token = jwtConvert.sign({email: user.email}, process.env.SECRETKEY)
                    console.log("Token dihasilkan:", token)
                    res.status(200).json({
                        access_token: token
                    })
                } else {
                    res.status(400).json({
                        message: 'Wrong Email/Password'
                    })
                }
            }

        })
    }
}

module.exports = UserController