require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3003;
const http = require('http');
const https = require('https');

const { connectDB, conn } = require('./src/db/connection');
const user = require('./src/db/user')
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

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/views/sign.html');
})

app.get('/', (req, res) => {
        res.sendFile(__dirname + '/public/views/home.html');
    })
    // app.get('/register', (req, res) => {
    //     res.sendFile(__dirname + '/public/views/register.html');
    // })

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/views/index.html');
// });

server.listen(PORT, () => {
    console.log(`Express app listening to PORT ${PORT}`);
})