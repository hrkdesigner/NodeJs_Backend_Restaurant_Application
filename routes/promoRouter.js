const express = require('express')
const promoRouter = express.Router()
const Promotion = require('../modles/promotions')
const authenticate = require('../authenticate')
const cors = require('./cors');


//Get all the promotions on endpoints GET PUT POST DELETE

promoRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .all((req, res, next) => {
        res.status(200)
        res.setHeader('Content-Type', 'application/json')
        next()
    })

    .get(cors.cors, (req, res, next) => {
        Promotion.find({})
            .then(data => {
                res.json(data)
            }, err => next(err))
            .catch(err => next(err))
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const promotion = req.body
        new Promotion(promotion).save()
            .then(data => res.json(data), err => next(err))
            .catch(err => next(err))
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        res.status(403)
        res.end('PUT operation is not applicable on /Promotion !!!')
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotion.remove({})
            .then(data => res.json(data))
            .catch(err => next(err), err => next(err))
    })


//Get SPECIFIC Promotion on endpoints GET PUT POST DELETE

promoRouter.route('/:promoId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res) => {
        const promotion = req.params.promoId
        Promotion.findById(promotion)
            .then(data => {
                if (data !== null) {
                    res.json(data)
                } else {
                    res.send(`User with this id :: ${promotion} was not found`)
                }
            }, err => next(err))
            .catch(err => next(err))
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        res.status(403)
        res.json('POST operation is not applicable on a specific promotion !!!')
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const promotion = req.params.promoId
        Promotion.findByIdAndUpdate(promotion, { $set: req.body }, { new: true })
            .then(data => res.json(data), err => next(err))
            .catch(err => next(err))
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const promotion = req.params.promoId
        Promotion.findByIdAndRemove(promotion)
            .then(data => {
                res.send(`User with this id :: ${promotion} was DELETED`)
            }, err => next(err))
            .catch(err => next(err))
    })

module.exports = promoRouter

