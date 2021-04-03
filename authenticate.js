const passport = require('passport')
const LocalStategy = require('passport-local').Strategy
const User = require('./modles/user')
const JwtStrategy = require('passport-jwt').Strategy
const jtw = require('jsonwebtoken')
const ExtractJwt = require('passport-jwt').ExtractJwt


exports.local = passport.use(new LocalStategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


const config = require('./config')

exports.getJwtToken = (user) => {
    return jtw.sign(user, config.secretKey, { expiresIn: 3600 })
}

const opts ={}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;


exports.jwtPassport = passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({_id: jwt_payload._id}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));


//ANOTHER USER AUTHENTICATION !! BY OTHER STUDENTS ON COURSERA
// exports.verifyUser = function (req, res, next) {
//     var token = req.body.token || req.query.token || req.headers['x-access-token'];
//     if (token) {
//         jwt.verify(token, config.secretKey, function (err, decoded) {
//             if (err) {
//                 var err = new Error('You are not authenticated!');
//                 err.status = 401;
//                 return next(err);
//             } else {
//                 req.user = decoded;
//                 next();
//             }
//         });
//     } else {
//         var err = new Error('No token provided!');
//         err.status = 403;
//         return next(err);
//     }
// };



exports.verifyUser = passport.authenticate('jwt' , {session : false})



exports.verifyAdmin = (req,res,next)=>{
    if(req.user.admin == true){
        next()
    }else{
        const err = new Error('You are not authorized to perform this operation!')
        res.statusCode = 403
        next(err)
    }
}