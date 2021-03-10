const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dishRouter = require('./dishRouter')
const promoRouter = require('./promoRouter')
const leaderRouter = require('./leaderRouter')


const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())


app.use('/dishes' , dishRouter)
app.use('/promotions' , promoRouter)
app.use('/leaders' , leaderRouter)




app.get('/' , (req,res)=>{
    res.end('<h1>Hello my dear classmate !</h1>')
})




const port = process.env.PORT || 3000
app.listen(port , ()=> console.log(`server is running on port ${port}`))