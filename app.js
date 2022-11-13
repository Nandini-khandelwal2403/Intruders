require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3009;
const http = require('http');
const https = require('https');

const { connectDB, conn } = require('./src/db/connection');
const Complain = require('./src/db/complain')
const User = require('./src/db/user');
const Post = require('./src/db/posts');
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
var multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
// const Grid = require('gridfs-stream');
// const methodOverride = require('method-override');

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
const { RegisterUser, LoginUser, LogoutUser, getUserDetails, complainUser } = require('./src/controller/auth_controller');

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

app.get('/api/user/:id', auth, async(req, res) => {
    if (!req.isAuth) {
        res.redirect('/login');
        return;
    }
    try {
        const user = await User.findOne({ number: req.params.id }, '-password');
        res.json(user);
    } catch (error) {
        console.log(error);
    }
});

//creating bucket
let bucket;
mongoose.connection.on("connected", () => {
    var client = mongoose.connections[0].client;
    var db = mongoose.connections[0].db;
    bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: "uploads"
    });
    console.log(bucket);
});

// storage engine
const storage = new GridFsStorage({
    url: process.env.MONGODB_URL,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = file.originalname;
            const fileInfo = {
                filename: filename,
                bucketName: 'uploads'
            };
            resolve(fileInfo);
        });
    }
});

const upload = multer({ storage });

app.post('/api/post/create', auth, async(req, res) => {
    if (!req.isAuth) {
        res.redirect('/login');
        return;
    }
    try {
        const post = new Post({
            user: req.user._id,
            msg: req.body.msg,
            time: req.body.time,
            username: req.body.username,
            name: req.body.name,
            pic: req.body.pic,
            picType: req.body.picType,
        });
        await post.save();
        res.json(post);
    } catch (error) {
        console.log(error);
    }
});

app.post('/api/post/imgcreate', auth, upload.single('file'), async(req, res) => {
    if (!req.isAuth) {
        res.redirect('/login');
        return;
    }
    // console.log(req.file);
    try {
        const post = new Post({
            user: req.user._id,
            msg: req.body.msg,
            time: req.body.time,
            username: req.body.username,
            name: req.body.name,
            img: req.file.id,
            imgType: req.file.contentType,
            pic: req.body.pic,
            picType: req.body.picType,
        });
        await post.save();
        post.file = req.file;
        res.json(post);
    } catch (error) {
        console.log(error);
    }
});

app.post('/api/user/pic', auth, upload.single('file'), async(req, res) => {
    if (!req.isAuth) {
        res.redirect('/login');
        return;
    }
    // console.log(req.file);
    try {
        let userModel = await User.findOneAndUpdate({ number: req.user.number }, { $set: { pic: req.file.id, picType: req.file.contentType } });
        userModel.file = req.file;
        res.json(userModel);
    } catch (error) {
        console.log(error);
    }
});

app.get('/api/user/getdp/:userid', auth, async(req, res) => {
    if (!req.isAuth) {
        res.redirect('/login');
        return;
    }
    try {
        let user = await User.findOne({ _id: req.params.userid });
        if (user.pic) {
            res.picType = user.picType;
            let objid = mongoose.Types.ObjectId(user.pic);
            bucket.openDownloadStream(objid).pipe(res);
        } else {
            res.json({ msg: 'No pic' });
        }
    } catch (error) {
        console.log(error);
    }
});

app.get("/api/files/get/:id", (req, res) => {
    const id = req.params.id;
    console.log(typeof id);
    console.log(mongoose.Types.ObjectId(id));
    bucket.openDownloadStream(mongoose.Types.ObjectId(id)).pipe(res);
});

app.get('/api/post/get', auth, async(req, res) => {
    if (!req.isAuth) {
        res.redirect('/login');
        return;
    }
    try {
        const posts = await Post.find({ user: req.user._id });
        res.json(posts);
    } catch (error) {
        console.log(error);
    }
});

app.get('/api/post/getall', auth, async(req, res) => {
    if (!req.isAuth) {
        res.redirect('/login');
        return;
    }
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        console.log(error);
    }
});

app.get('/api/post/getallfromid/:id', auth, async(req, res) => {
    if (!req.isAuth) {
        res.redirect('/login');
        return;
    }
    try {
        const user = await User.findOne({ number: req.params.id });
        const posts = await Post.find({ username: user.email.split('@')[0] });
        res.json(posts);
    } catch (error) {
        console.log(error);
    }
});

app.post('/api/post/incrementlikes', auth, async(req, res) => {
    if (!req.isAuth) {
        res.redirect('/login');
        return;
    }
    try {
        const post = await Post.findOne({ _id: req.body.postid });
        post.likecount = post.likecount + 1;
        post.likes.push(req.user._id);
        await post.save();
        res.json(post);
    } catch (error) {
        console.log(error);
    }
});

app.post('/api/user/complain', complainUser);

app.get('/complaints', (req, res) => {
    res.sendFile(__dirname + '/public/views/form.html');
})

app.get('/emergency', (req, res) => {
    res.sendFile(__dirname + '/public/views/people.html');

})

app.get('/profile', auth, (req, res) => {
    if (!req.isAuth) {
        res.redirect('/login');
        return;
    }
    res.redirect('/profile/' + req.user.number);
})

app.get('/profile/:id', auth, (req, res) => {
    if (!req.isAuth) {
        res.redirect('/login');
        return;
    }
    res.sendFile(__dirname + '/public/views/profile.html');
})

app.get('/menulist', (req, res) => {
    res.sendFile(__dirname + '/public/views/menulist.html');
})

app.get('/login', (req, res) => {
    if (req.isAuth) {
        res.redirect('/profile');
        return;
    }
    res.sendFile(__dirname + '/public/views/sign.html');
});

app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/public/views/home.html');
});

app.get('/feed', auth, (req, res) => {
    if (!req.isAuth) {
        res.redirect('/login');
        return;
    }
    res.sendFile(__dirname + '/public/views/feed.html');
});

app.get('/calender', (req, res) => {
    res.sendFile(__dirname + '/public/views/index.html');
});

app.get('/map', (req, res) => {
    res.sendFile(__dirname + '/public/views/map.html');
});

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/public/views/about.html');
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