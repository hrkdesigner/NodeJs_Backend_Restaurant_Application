const express = require('express')
const mongoose = require('mongoose')
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;


const PromoSchema = mongoose.Schema
const promoSchema = new PromoSchema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })


module.exports = mongoose.model('Promotions' , promoSchema)