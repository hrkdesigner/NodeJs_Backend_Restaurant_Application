const express = require('express') 
const leaderRouter = express.Router()





leaderRouter.route('/')
    .all((req, res, next) => {
        res.status(200)
        res.setHeader('Content-Type', 'text/plain')
        next()
    })

    .get((req, res) => {
        res.end('GET all the leaders')
    })

    .post((req, res) => {
        res.end(`POST a new leader with a name : ${req.body.name} and description : ${req.body.description} to the leaders`)
    })

    .put((req, res) => {
        res.status(403)
        res.end('PUT operation is not applicable on /leaders !!!')
    })

    .delete((req, res) => {
        res.end('Deleting all the leaders')
    })



dishRouter.route('/:leaderId')
    .get((req,res)=>{
        res.end(`To GET an specific leader with id : ${req.params.leaderId}`)
    })

    .post((req,res)=>{
        res.status(403)
        res.end('POST operation is not applicable on a specific leader !!!')
    })

    .put((req,res)=>{
        res.end(`To UPDATE an specific leader with id : ${req.params.leaderId}`)
    })

    .delete((req,res)=>{
        res.end(`To DELETE an specific leader with id : ${req.params.leaderId}`)
    })

module.exports = dishRouter

