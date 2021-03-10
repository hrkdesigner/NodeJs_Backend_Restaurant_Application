const express = require('express') 
const dishRouter = express.Router()





dishRouter.route('/')
    .all((req, res, next) => {
        res.status(200)
        res.setHeader('Content-Type', 'text/plain')
        next()
    })

    .get((req, res) => {
        res.end('GET all the dishes')
    })

    .post((req, res) => {
        res.end(`POST a new dish with a name : ${req.body.name} and description : ${req.body.description} to the dishes`)
    })

    .put((req, res) => {
        res.status(403)
        res.end('PUT operation is not applicable on /dishes !!!')
    })

    .delete((req, res) => {
        res.end('Deleting all the dishes')
    })



dishRouter.route('/:dishId')
    .get((req,res)=>{
        res.end(`To GET an specific dish with id : ${req.params.dishId}`)
    })

    .post((req,res)=>{
        res.status(403)
        res.end('POST operation is not applicable on a specific dish !!!')
    })

    .put((req,res)=>{
        res.end(`To UPDATE an specific dish with id : ${req.params.dishId}`)
    })

    .delete((req,res)=>{
        res.end(`To DELETE an specific dish with id : ${req.params.dishId}`)
    })

module.exports = dishRouter

