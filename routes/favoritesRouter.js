const express = require('express')
const favoriteRouter = express.Router()
const authenticate = require('../authenticate')
const Favorites = require('../modles/favorite')
const Dish = require('../modles/dishes')
const cors = require('./cors');



favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .all((req, res, next) => {
        res.status(200)
        res.setHeader('Content-Type', 'application/json')
        next()
    })




favoriteRouter.get('/', cors.cors, authenticate.verifyUser, (req, res, next) => {
    const userId = req.user._id

    Favorites.findOne({ user: userId })
        .populate('dishes')
        .populate('user')
        .then(dishes => {
            if (dishes) {
                res.status(200)
                res.json(dishes)
                return
            } else {
                res.status(403)
                res.json({ errMessage: 'No user found' })
                return
            }

        }, err => next(err))
        .catch(err => {
            next(err)
        })
})

favoriteRouter.post('/', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    const userId = req.user._id
    if (req.body.length != null) {
        Favorites.findOne({ user: userId })
            .then(dishFavorite => {
                if (!dishFavorite) {
                    res.status(403)
                    res.json({ errMessage: 'User not found' })
                    return

                } else {
                    for (let i = 0; i < req.body.length; i++) {
                        let verify = dishFavorite.dishes[i]
                        if (verify) {
                            res.status(403)
                            res.json('Dish has already been declared to your favorite')
                            continue
                        } else {
                            dishFavorite.dishes.push(req.body[i]._id)
                        }
                    }
                    dishFavorite.save()
                        .then(result => {
                            res.json(result)
                        })
                        .catch(err => next(err))
                    return
                }
            })
            .catch(err => next(err))
    }
    else {
        res.status(403)
        res.json({ errMessage: 'There is no data to be added into the server' })
        return
    }
})


favoriteRouter.delete('/', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    const userId = req.user._id
    Favorites.findOne({ user: userId })
        .then(dishFavorite => {
            if (dishFavorite) {
                dishFavorite.remove()
                res.status(200)
                res.json({ message: 'Document deleted successfully' })
            } else {
                res.status(403)
                res.json({ errMessage: 'User not found' })
            }
        })
})





favoriteRouter.post('/:id', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    const userId = req.user._id
    const dishId = req.params.id

    Dish.findById(dishId)
        .then(dish => {
            if (dish) {
                Favorites.findOne({ user: userId })
                    .then(dishFavorite => {
                        if (dishFavorite) {
                            const verify = dishFavorite.dishes.find(dish => dish == dishId)
                            if (verify) {
                                res.status(403)
                                res.json('Dish has already been declared to your favorite')
                                return
                            } else {
                                dishFavorite.dishes.push(dishId)
                                dishFavorite.save()
                                    .then(result => {
                                        res.status(200)
                                        res.json(result)
                                        return
                                    })
                                    .catch(err => next(err))
                            }
                        } else {
                            new Favorites({
                                user: userId,
                                dishes: dishId
                            })
                                .save()
                                .then(newDish => {
                                    res.status(200)
                                    res.json(newDish)
                                })
                                .catch(err => next(err))
                        }
                    })
            } else {
                res.status(403)
                dish.json(`Dish with the given id : ${dishId} does not exist`)
                return
            }
        }, err => next(err))
        .catch(err => next(err))
})




favoriteRouter.delete('/:id', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    const userId = req.user._id
    const dishId = req.params.id
    Favorites.findOne({ user: userId })
        .then(dishFavorite => {
            if (dishFavorite == null) {
                res.status(403)
                res.json({ errMessage: 'User not found' })
                return
            } else {
                const result = dishFavorite.dishes.indexOf(dishId)
                if (result != -1) {
                    Favorites.findByIdAndDelete(dishId)
                        .then(result => {
                            res.status(200)
                            res.json(dishFavorite)
                            return
                        })
                        .catch(err => next(err))
                } else {
                    res.status(403)
                    res.json(`Dish with the given id : ${dishId} does not exist`)
                    return
                }
                res.json(dishFavorite)
                return
            }
        })
})




module.exports = favoriteRouter