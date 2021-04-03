const express = require('express')
const bodyParser = require('body-parser');
const User = require('../modles/user');
const passport = require('passport')
const authenticate = require('../authenticate')
const cors = require('./cors');



const userRouter = express.Router()


userRouter.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    User.find({})
        .then(data => {
            res.json(data)
        })
        .catch(err => next(err))
})

userRouter.post('/signup', cors.corsWithOptions, (req, res) => {
    User.register({ username: req.body.username }, req.body.password, (err, user) => {
        if (err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err })
        } else {
            if (req.body.firstname) {
                user.firstname = req.body.firstname
            }

            if (req.body.lastname) {
                user.lastname = req.body.lastname
            }
            user.save((err, data) => {
                if (err) {
                    res.statusCode = 500
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ err: err })
                } else {
                    // User.authenticate(req.body.username, req.body.password, function (err, result) {
                    //     if (err) {
                    //         res.statusCode = 500
                    //         res.setHeader('Content-Type', 'application/json');
                    //         res.json({ err: err })
                    //     }
                    //     else {
                    //         res.statusCode = 200;
                    //         res.setHeader('Content-Type', 'application/json');
                    //         res.json({ success: true, status: 'Registration Successful!' })
                    //     }
                    // })
                    User.authenticate('local')(req, res, () => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ success: true, status: 'Registration Successful!' })
                    })
                }
            })

        }
    })
})

userRouter.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
    const token = authenticate.getJwtToken({ _id: req.user._id })
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, status: 'You are successfully logged in' })
})



userRouter.get('/logout', cors.corsWithOptions, (req, res, next) => {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    }
    else {
        const err = new Error('You are not logged in!');
        err.status = 403;
        next(err);
    }
})



module.exports = userRouter




