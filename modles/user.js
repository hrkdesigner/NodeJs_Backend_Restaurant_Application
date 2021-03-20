const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')


const User = new Schema({

    // With use of Passport we do not need username and password as it adds to our model Automatically !!

    // username: {
    // type: String,
    // required: true,
    // unique: true
    // },
    // password:  {
    // type: String,
    // required: true
    // },

    admin: {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', User);

