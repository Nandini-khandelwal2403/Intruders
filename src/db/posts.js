const mongoose = require('mongoose');

const post = new mongoose.Schema({
    msg: {
        type: String,
        required: [true, 'The title field is required!'],
        trim: true,
        maxlength: 100
    },
    user: {
        type: String,
        required: [true, 'The user field is required!'],
        trim: true,
        maxlength: 100
    },
    name: {
        type: String,
        required: [true, 'The name field is required!'],
        trim: true,
        maxlength: 100
    },
    username: {
        type: String,
        required: [true, 'The username field is required!'],
        trim: true,
        maxlength: 100
    },
    time: {
        type: String,
        required: [true, 'The time field is required!'],
        trim: true,
        maxlength: 100
    },
    likes: {
        type: Array,
    },
    likecount: {
        type: Number,
        default: 0
    },
}, { minimize: false });

module.exports = Post = mongoose.model('post', post);