const mongoose = require('mongoose');
const User = require('../db/complain');

const complainBox = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'The name field is required!'],
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: [true, 'The email field is required!'],
        trim: true,
    },
    enroll: {
        type: String,
        required: [true, 'The enroll field is required!'],
        trim: true,
        unique: 1
    },
    type: {
        type: String,
        required: [true, 'The type field is required!'],
        trim: true
    },
    complain: {
        type: String,
        required: [true, 'The complain field is required!'],
        trim: true
    }
})

module.exports = Complain = mongoose.model('complainBox', complainBox);