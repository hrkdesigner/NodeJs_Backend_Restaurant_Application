const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const app = express()

//Our middlewares
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())



// Router
const dishRouter = require('./routes/dishRouter')
const promoRouter = require('./routes/promoRouter')
const leaderRouter = require('./routes/leaderRouter')
app.use('/dishes', dishRouter)
app.use('/promotions', promoRouter)
app.use('/leaders', leaderRouter)



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


//Our endpoints
app.get('/', (req, res) => {
   res.send('ok')
})


//Connection to our server
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`server is running on port ${port}`))