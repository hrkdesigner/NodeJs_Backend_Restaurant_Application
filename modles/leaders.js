const express = require('express')
const mongoose = require('mongoose')



const LeaderSchema = mongoose.Schema
const leaderSchema = new LeaderSchema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        require: true
    },
    abbr: {
        type: String,
        required: true,
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


module.exports = mongoose.model('Leaders', leaderSchema)