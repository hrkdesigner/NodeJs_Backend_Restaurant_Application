const express = require('express')
const dishRouter = express.Router()
const mongoose = require('mongoose')
const Dishes = require('../modles/dishes')
const authenticate = require('../authenticate')





dishRouter.route('/')
    .all((req, res, next) => {
        res.status(200)
        res.setHeader('Content-Type', 'application/json')
        next()
    })

    .get((req, res, next) => {
        Dishes.find({})
            .populate('comments.author')
            .then(response => {
                res.json(response)
                res.end()
            }, err => next(err))
            .catch(err => next(err))
    })

    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        //   We can use either Dishes.create()   OR     new Dishes().save()
        const newData = new Dishes(req.body).save()
        newData
            .then(dish => res.json(dish))
            .catch(err => console.log(`newData is not added :: ${err.message}`))
    })

    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.status(403)
        res.end('PUT operation is not applicable on /dishes !!!')
    })

    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const deleteData = Dishes.remove({})
        deleteData
            .then(data => {
                console.log(`All data deleted`)
                res.json(data)

            }, err => next(err))
            .catch(err => next(err))
    })



dishRouter.route('/:dishId')
    .get((req, res, next) => {
        const endPoint = req.params.dishId
        Dishes.findById(endPoint)
            .populate('comments.author')
            .then(data => {
                if (data != null) {
                    res.json(data)
                } else {
                    res.send(`the Document with the given id : ${endPoint} was not found`)
                    return
                }
            }, err => next(err))
            .catch(err => next(err))
    })

    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        res.status(403)
        res.end('POST operation is not applicable here !!!')
    })

    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const endPoint = req.params.dishId
        Dishes.findByIdAndUpdate(endPoint, { $set: req.body }, { new: true })
            .then(data => {
                res.json(data)
            }, err => next(err))
            .catch(err => next(err))
    })

    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const endPoint = req.params.dishId
        Dishes.findByIdAndRemove(endPoint)
            .then(data => res.json(data), err => next(err))
            .catch(err => next(err))
    })




//Routes for Comments

dishRouter.route('/:dishId/comments')
    .get((req, res, next) => {
        const endPoint = req.params.dishId
        Dishes.findById(endPoint)
            .populate('comments.author')
            .then(data => {
                if (data != null) {
                    res.json(data.comments)
                } else {
                    const err = new Error(`Dish with the given id :: ${endPoint} was not found`)
                    res.status = 404
                    return next(err)
                }
            }, err => next(err))
            .catch(err => next(err))
    })




    .post(authenticate.verifyUser, (req, res, next) => {
        const endPoint = req.params.dishId
        Dishes.findById(endPoint)
            .then(data => {
                if (data != null) {
                    req.body.author = req.user._id
                    data.comments.push(req.body)
                    data.save()
                        .then(dish => {
                            Dishes.findById(dish._id)
                                .populate('comments.author')
                                .then(dish => {
                                    res.statusCode = 200
                                    res.setHeader('Content-Type', 'application/json')
                                    res.json(dish)
                                }, err => next(err))
                        })
                        .catch(err => next(err))
                } else {
                    const err = new Error(`Dish with the given id :: ${endPoint} was not found`)
                    res.status = 404
                    return next(err)
                }
            }, err => next(err))
            .catch(err => next(err))
    })

    .put((req, res, next) => {
        res.status = 403
        res.json(`This operation is not applicable with this request`)
    })

    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const endPoint = req.params.dishId
        Dishes.findById(endPoint)
            .then(data => {
                if (data != null) {
                    if (data.comments != null) {
                        for (let i = (data.comments.length - 1); i >= 0; i--) {
                            data.comments.id(data.comments[i]._id).remove()
                        }
                        data.save()
                            .then(result => {
                                res.json(result)
                            })
                            .catch(err => next(err))

                    } else {
                        res.json(`Document with the given id :: ${endPoint} has no comment`)
                    }

                } else {
                    const err = new Error(`Dish with the given id :: ${endPoint} was not found`)
                    res.status = 404
                    return next(err)
                }
            }, err => next(err))
            .catch(err => next(err))
    })


//Routes for each specific comment


dishRouter.route('/:dishId/comments/:commentId')
    .get((req, res, next) => {
        const endPoint = req.params.dishId
        const commentId = req.params.commentId
        Dishes.findById(endPoint)
            .populate('comments.author')
            .then(data => {
                if (data != null && data.comments.id(commentId) != null) {
                    res.json(data.comments.id(commentId))
                } else if (data == null) {
                    const err = new Error(`Dish with the given id :: ${endPoint} was not found`)
                    res.status = 404
                    return next(err)

                } else {
                    const err = new Error(`Comments with the given id :: ${commentId} was not found in comment lists`)
                    res.status = 404
                    return next(err)
                }
            }, err => next(err))
            .catch(err => next(err))
    })

    .post(authenticate.verifyUser, (req, res, next) => {
        res.status(403)
        res.json('POST operation is not applicable with this request')
    })

    .put((req, res, next) => {
        const endPoint = req.params.dishId
        const commentId = req.params.commentId
        Dishes.findById(endPoint)
            .then(data => {
                if (data != null && data.comments.id(commentId) != null) {
                    if (data.comments.id(commentId).author._id == req.user._id) {
                        if (req.body.rating) {
                            data.comments.id(commentId).rating = req.body.rating
                        }
                        if (req.body.comment) {
                            data.comments.id(commentId).comment = req.body.comment
                        }
                        data.save()
                            .then(dish => {
                                console.log(dish)
                                Dishes.findById(dish._id)
                                    .populate('comments.author')
                                    .then(dish => {
                                        res.json(dish)
                                    }, err => next(err))
                            })
                            .catch(err => next(err))
                    } else {
                        const err = new Error(`You can not do this uperation`)
                        res.status = 404
                        return next(err)
                    }

                } else {
                    const err = new Error(`Comments with the given id :: ${commentId} was not found in comment lists`)
                    res.status = 404
                    return next(err)
                }
            }, err => next(err))
            .catch(err => next(err))
    })



    .delete((req, res, next) => {
        const endPoint = req.params.dishId
        const commentId = req.params.commentId
        Dishes.findById(endPoint)
            .then(data => {
                if (data != null && data.comments.id(commentId) != null) {
                    if (data.comments.id(commentId).author._id === req.user._id) {
                        data.comments.id(commentId).remove()
                        data.save()
                            .then(dish => {
                                Dishes.findById(dish._id)
                                    .populate('comments.author')
                                    .then(dish => {
                                        res.json(dish)
                                    }, err => next(err))
                                    .catch(err => next(err))
                            })
                            .catch(err => next(err))
                    } else {
                        const err = new Error(`You can not do this uperation`)
                        res.status = 404
                        return next(err)
                    }


                } else if (data == null) {
                    const err = new Error(`Dish with the given id :: ${endPoint} was not found`)
                    res.status = 404
                    return next(err)

                } else {
                    const err = new Error(`Comments with the given id :: ${commentId} was not found in comment lists`)
                    res.status = 404
                    return next(err)
                }
            }, err => next(err))
            .catch(err => next(err))
    })


module.exports = dishRouter

