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
    time: {
        type: String,
        required: [true, 'The time field is required!'],
        trim: true,
        maxlength: 100
    },
}, { minimize: false });

module.exports = Post = mongoose.model('post', post);