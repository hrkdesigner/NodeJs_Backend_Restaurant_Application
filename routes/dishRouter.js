const express = require('express')
const dishRouter = express.Router()
const mongoose = require('mongoose')
const Dishes = require('../modles/dishes')
const authenticate = require('../authenticate')
const cors = require('./cors');






dishRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .all((req, res, next) => {
        res.status(200)
        res.setHeader('Content-Type', 'application/json')
        next()
    })

    .get(cors.cors, (req, res, next) => {
        Dishes.find({})
            .populate('comments.author')
            .then(response => {
                res.json(response)
                res.end()
            }, err => next(err))
            .catch(err => next(err))
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        //   We can use either Dishes.create()   OR     new Dishes().save()
        new Dishes(req.body)
            .save()
            .then(dish => res.json(dish))
            .catch(err => console.log(`newData is not added :: ${err.message}`))
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.status(403)
        res.end('PUT operation is not applicable on /dishes !!!')
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const deleteData = Dishes.remove({})
        deleteData
            .then(data => {
                console.log(`All data deleted`)
                res.json(data)

            }, err => next(err))
            .catch(err => next(err))
    })



dishRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
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

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        res.status(403)
        res.end('POST operation is not applicable here !!!')
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const endPoint = req.params.dishId
        Dishes.findByIdAndUpdate(endPoint, { $set: req.body }, { new: true })
            .then(data => {
                res.json(data)
            }, err => next(err))
            .catch(err => next(err))
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const endPoint = req.params.dishId
        Dishes.findByIdAndRemove(endPoint)
            .then(data => res.json(data), err => next(err))
            .catch(err => next(err))
    })




//Routes for Comments

dishRouter.route('/:dishId/comments')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
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




    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
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

    .put(cors.corsWithOptions, (req, res, next) => {
        res.status = 403
        res.json(`This operation is not applicable with this request`)
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
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

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.status(403)
        res.json('POST operation is not applicable with this request')
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        const endPoint = req.params.dishId
        const commentId = req.params.commentId
        Dishes.findById(endPoint)
            .then(data => {
                if (data != null && data.comments.id(commentId) != null) {
                    if (parseInt(data.comments.id(commentId).author._id) === parseInt(req.user._id)) {
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



    .delete(cors.corsWithOptions, (req, res, next) => {
        const endPoint = req.params.dishId
        const commentId = req.params.commentId
        Dishes.findById(endPoint)
            .then(data => {
                if (data != null && data.comments.id(commentId) != null) {
                    if (parseInt(data.comments.id(commentId).author._id) === parseInt(req.user._id)) {
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






//GOOD STUDENT HOMEWORK ::



// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const authenticate = require('../authenticate');
// const cors = require('./cors');

// const Favorites = require('../models/favorite');

// const favoriteRouter = express.Router();

// favoriteRouter.use(bodyParser.json());

// const getNonExistingDishIds = (dishIds, existingDishIds) => {
//     var nonExistingDishIds = [];
//     dishIds.forEach((id, index) => {
//         if (!isDishIdIn(id, existingDishIds)) {
//             nonExistingDishIds.push(id);
//         }
//     });
//     return nonExistingDishIds;
// }

// const isDishIdIn = (dishId, dishIds) => {
//     return dishIds.some((id) => {
//         return id.equals(dishId);
//     });
// }

// favoriteRouter.route('/')
// .options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
// .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
//     Favorites.findOne({ user: req.user._id})
//     .populate('user')
//     .populate('dishes')
//     .then((favorites) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(favorites);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     Favorites.findOne({ user: req.user._id})
//     .then((favorites) => {
//         if (favorites == null) {
//             Favorites.create({ user: req.user._id,
//                 dishes: getNonExistingDishIds(req.body.map(entry => entry._id), [])})
//             .then((favorites) => {
//                 console.log('Favorites Created ', favorites);
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(favorites);
//             }, (err) => next(err))
//             .catch((err) => next(err));
//         } else {
//             var newFavoriteDishes = getNonExistingDishIds(req.body.map(entry => entry._id),
//                 favorites.dishes);
//             if (newFavoriteDishes.length > 0) {
//                 favorites.dishes = favorites.dishes.concat(newFavoriteDishes);
//                 favorites.save()
//                 .then((favorites) => {
//                     console.log('Favorites Updated ', favorites);
//                     res.statusCode = 200;
//                     res.setHeader('Content-Type', 'application/json');
//                     res.json(favorites);
//                 }, (err) => next(err));
//             } else {
//                 console.log('All dishes already in favorites');
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(favorites);
//             }
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /favorites');
// })
// .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     Favorites.findOne({ user: req.user._id})
//     .then((favorites) => {
//         if (favorites == null) {
//             console.log('No favorites, delete is unnecessary');
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json(favorites);
//         } else {
//             Favorites.findByIdAndRemove(favorites._id)
//             .then((resp) => {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(resp);
//             }, (err) => next(err))
//             .catch((err) => next(err));
//         }
//     }, (err) => next(err))
// });

// favoriteRouter.route('/:dishId')
// .options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
// .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
//     res.statusCode = 403;
//     res.end('GET operation not supported on /favorites/' + req.params.dishId);
// })
// .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     Favorites.findOne({ user: req.user._id})
//     .then((favorites) => {
//         if (favorites == null) {
//             Favorites.create({ user: req.user._id, dishes: Array.of(req.params.dishId)})
//             .then((favorites) => {
//                 console.log('Favorites Created ', favorites);
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(favorites);
//             }, (err) => next(err))
//             .catch((err) => next(err));
//         } else if (!isDishIdIn(req.params.dishId, favorites.dishes)) {
//             favorites.dishes.push(req.params.dishId);
//             favorites.save()
//             .then((favorites) => {
//                 console.log('Favorites Updated ', favorites);
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(favorites);
//             }, (err) => next(err));
//         } else {
//             console.log('Favorites already contains dish ' + req.params.dishId);
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json(favorites);
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /favorites/' + req.params.dishId);
// })
// .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     Favorites.findOne({ user: req.user._id})
//     .then((favorites) => {
//         if (favorites == null) {
//             console.log('No favorites, delete is unnecessary for dish ' + req.params.dishId);
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json(favorites);
//         } else if (isDishIdIn(req.params.dishId, favorites.dishes)) {
//             favorites.dishes = favorites.dishes.filter(dish => !dish.equals(req.params.dishId));
//             favorites.save()
//             .then((favorites) => {
//                 console.log('Favorites Updated ', favorites);
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(favorites);
//             }, (err) => next(err));
//         } else {
//             console.log('Favorites does not contain dish ' + req.params.dishId + ' => no need to delete');
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json(favorites);
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// });

// module.exports = favoriteRouter;