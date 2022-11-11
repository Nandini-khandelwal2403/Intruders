require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3009;
const http = require('http');
const https = require('https');

const { connectDB, conn } = require('./src/db/connection');
const User = require('./src/db/user');
const Post = require('./src/db/posts');
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

// app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(cors());
// app.use(json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);

// connection with Database
connectDB();

const { auth } = require('./src/middleware/auth')
const { RegisterUser, LoginUser, LogoutUser, getUserDetails } = require('./src/controller/auth_controller');

app.post('/api/user/register', RegisterUser);
app.post('/api/user/login', LoginUser);

app.get('/api/user/auth', auth, getUserDetails);
app.get('/api/user/logout', auth, LogoutUser);

app.get('/api/user/data', auth, async(req, res) => {
    if (!req.isAuth) {
        res.redirect('/login');
        return;
    }
    try {
        const user = await User.findOne({ number: req.user.number }, '-password');
        res.json(user);
    } catch (error) {
        console.log(error);
    }
});

app.get('/login', auth, (req, res) => {
    if (req.isAuth) {
        res.redirect('/profile');
        return;
    }
    res.sendFile(__dirname + '/public/views/sign.html');
});

app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/public/views/home.html');
});

app.get('/profile', auth, (req, res) => {
    if (!req.isAuth) {
        res.redirect('/login');
        return;
    }
    res.sendFile(__dirname + '/public/views/profile2.html');
});

// app.get('/register', (req, res) => {
//     res.sendFile(__dirname + '/public/views/register.html');
// })

app.get('/', (req, res) => {
    res.redirect('/home');
});

server.listen(PORT, () => {
    console.log(`Express app listening to PORT ${PORT}`);
})