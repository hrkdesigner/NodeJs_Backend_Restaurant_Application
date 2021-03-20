const passport = require('passport')
const localStategy = require('passport-local').Strategy
const User = require('./modles/user')


exports.local = passport.use(new localStategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())