const express = require('express')
const leaderRouter = express.Router()
const Leaders = require('../modles/leaders')




//Get all the leaders on endpoints GET PUT POST DELETE

leaderRouter.route('/')
    .all((req, res, next) => {
        res.status(200)
        res.setHeader('Content-Type', 'application/json')
        next()
    })

    .get((req, res, next) => {
        Leaders.find({})
            .then(data => {
                res.json(data)
            }, err => next(err))
            .catch(err => next(err))
    })

    .post((req, res, next) => {
        const leader = req.body
        new Leaders(leader).save()
            .then(data => res.json(data), err => next(err))
            .catch(err => next(err))
    })

    .put((req, res) => {
        res.status(403)
        res.end('PUT operation is not applicable on /leaders !!!')
    })

    .delete((req, res, next) => {
        Leaders.remove({})
            .then(data => res.json(data))
            .catch(err => next(err), err => next(err))
    })


//Get SPECIFIC leaders on endpoints GET PUT POST DELETE

leaderRouter.route('/:leaderId')

    .get((req, res) => {
        const leader = req.params.leaderId
        Leaders.findById(leader)
            .then(data => {
                if (data !== null) {
                    res.json(data)
                } else {
                   res.send( `User with this id :: ${leader} was not found`)
                }
            }, err => next(err))
            .catch(err => next(err))
    })

    .post((req, res) => {
        res.status(403)
        res.json('POST operation is not applicable on a specific leader !!!')
    })

    .put((req, res, next) => {
        const leader = req.params.leaderId
        Leaders.findByIdAndUpdate(leader, { $set: req.body }, { new: true })
            .then(data => res.json(data), err => next(err))
            .catch(err => next(err))
    })

    .delete((req, res, next) => {
        const leader = req.params.leaderId
        Leaders.findByIdAndRemove(leader)
            .then(data => {
                res.send(`User with this id :: ${leader} was DELETED`)
            }, err => next(err))
            .catch(err => next(err))
    })

module.exports = leaderRouter

