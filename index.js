const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const dishRouter = require('./routes/dishRouter')
const promoRouter = require('./routes/promoRouter')
const leaderRouter = require('./routes/leaderRouter')
const Dishes = require('./modles/Dishes')
const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())



app.use('/dishes', dishRouter)
app.use('/promotions', promoRouter)
app.use('/leaders', leaderRouter)

const url = 'mongodb://localhost/dishDatabase'
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(console.log('Mongodb is connected'))
    .catch(err => {
        console.log(`Mongoose connection failed , ${err.message}`)
    })



app.get('/', (req, res) => {
   res.send('ok')
})



const port = process.env.PORT || 3000
app.listen(port, () => console.log(`server is running on port ${port}`))