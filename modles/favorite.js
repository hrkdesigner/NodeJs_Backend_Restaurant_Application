const mongoose = require('mongoose')
const Schema = mongoose.Schema



const favoriteDish = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }]
}, {timestamps : true})

const Favorites = mongoose.model('Favorite', favoriteDish)
module.exports = Favorites