const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const cookiParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const configure = require('./configure')

//If you do not have a database you could youse the  FILESTORE below to save the sessions after your server is turned off 
const fileStore = require('session-file-store')(session)
const dishRouter = require('./routes/dishRouter')
const promoRouter = require('./routes/promoRouter')
const leaderRouter = require('./routes/leaderRouter')
const userRouter = require('./routes/userRouter')


// Server Initialization 
const app = express()

//Connection to mongoose
const url = 'mongodb://localhost/courseraDb'
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(console.log('Mongodb is connected'))
    .catch(err => {
        console.log(`Mongoose connection failed , ${err.message}`)
    })

//Our middlewares
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//Session or cookie parser, we used cookie parser in previous example
// app.use(cookiParser('12345-67890-09876-54321'))
app.use(session({
    name: 'session-id',
    secret: '12345-67890-09876-54321',
    resave: false,
    saveUninitialized: false,
    store: new fileStore()
}))

app.use(passport.initialize())
app.use(passport.session())


//Basic Authentication by using signedCookies
// function auth(req, res, next) {
//     if (!req.session.user) {

//         const authHeader = req.headers.authorization
//         if (!authHeader) {
//             const err = new Error('You are not authorized')
//             res.setHeader('WWW-Authenticate', 'Basic')
//             err.status = 403
//             return next(err)
//         }

//         const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':')
//         const username = auth[0]
//         const password = auth[1]

//         if (username === 'admin' && password === 'password') {
//             // res.cookie('user', 'admin', { signed: true })
//             req.session.user = 'admin'
//             console.log('You are authorized')
//             next()
//         } else {
//             const err = new Error('You are not authorized')
//             res.setHeader('WWW-Authenticate', 'Basic')
//             err.status = 403
//             return next(err)
//         }

//     } else {
//         if (req.session.user === 'admin') {
//             console.log('req.session: ', req.session)
//             next()
//         } else {
//             const err = new Error('You are not authorized')
//             err.status = 403
//             return next(err)
//         }
//     }

// }




function auth(req, res, next) {
    // console.log(req.session);
    // if(req.session.user){}
    if (!req.user) {
        var err = new Error('You are not authenticated!');
        err.status = 403;
        return next(err);
    }
    else {
        // if (req.session.user === 'authenticated') {
        //     next();
        // }
        // else {
        //     var err = new Error('You are not authenticated!');
        //     err.status = 403;
        //     return next(err);
        // }

        next()
    }
}




app.use(auth)
app.use(express.static(__dirname + 'public'))

// Routes
app.use('/dishes', dishRouter)
app.use('/promotions', promoRouter)
app.use('/leaders', leaderRouter)
app.use('/user', userRouter)

//Our endpoints
app.get('/', (req, res) => {
    res.send('<h1>Hi my Server</h1>')
})


//Connection to our server
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`server is running on port ${port}`))