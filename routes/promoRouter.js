const express = require('express') 
const promoRouter = express.Router()





promoRouter.route('/')
    .all((req, res, next) => {
        res.status(200)
        res.setHeader('Content-Type', 'text/plain')
        next()
    })

    .get((req, res) => {
        res.end('GET all the promotions')
    })

    .post((req, res) => {
        res.end(`POST a new dish with a name : ${req.body.name} and title : ${req.body.title} to the promotions`)
    })

    .put((req, res) => {
        res.status(403)
        res.end('PUT operation is not applicable on /promotions !!!')
    })

    .delete((req, res) => {
        res.end('Deleting all the promotions')
    })

    

promoRouter.route('/:promoId')
    .get((req,res)=>{
        res.end(`To GET an specific promotion with id : ${req.params.promoId}`)
    })

    .post((req,res)=>{
        res.status(403)
        res.end('POST operation is not applicable on a specific promotion !!!')
    })

    .put((req,res)=>{
        res.end(`To UPDATE an specific promotion with id : ${req.params.promoId}`)
    })

    .delete((req,res)=>{
        res.end(`To DELETE an specific promotion with id : ${req.params.promoId}`)
    })

module.exports = promoRouter

