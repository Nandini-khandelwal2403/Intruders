const User = require('../db/user');

exports.RegisterUser = async(req, res) => {
    const user = new User(req.body);

    await user.save((err, doc) => {
        if (err) {
            console.log(err);
            return res.status(422).json({ errors: err })
        } else {
            const userData = {
                name: doc.name,
                enroll: doc.enroll,
                number: doc.number,
                email: doc.email,
                branch: doc.branch,
                program: doc.program,
                year: doc.year
            }
            return res.status(200).json({
                success: true,
                message: 'Successfully Signed Up',
                userData
            })
        }
    });
};

exports.LoginUser = (req, res) => {
    User.findOne({ 'number': req.body.number }, (err, user) => {
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found!' });
        } else {
            user.comparePassword(req.body.password, (err, isMatch) => {
                console.log(isMatch);
                //isMatch is eaither true or false
                if (!isMatch) {
                    return res.status(400).json({ success: false, message: 'Wrong Password!' });
                } else {
                    user.generateToken((err, user) => {
                        if (err) {
                            return res.status(400).send({ err });
                        } else {
                            const data = {
                                    userID: user._id,
                                    name: user.name,
                                    number: user.number,
                                    enroll: user.enroll,
                                    email: user.email,
                                    token: user.token
                                }
                                //saving token to cookie
                            res.cookie('authToken', user.token).status(200).json({
                                success: true,
                                message: 'Successfully Logged In!',
                                userData: data
                            })
                        }
                    });
                }
            });
        }
    });
};

exports.LogoutUser = (req, res) => {
    User.findByIdAndUpdate({ _id: req.user._id }, { token: '' },
        (err) => {
            console.log('entered logout');
            if (err) return res.json({ success: false, err })
            console.log('logging out');
            return res.cookie('authToken', '', { maxAge: 1 }).status(200).send({ success: true, message: 'Successfully Logged Out!' });
        })
};

//get authenticated user details
exports.getUserDetails = (req, res) => {
    return res.status(200).json({
        isAuthenticated: true,
        name: req.user.name,
        number: req.user.number,
        email: req.user.email,
        enroll: req.user.enroll
            // contacts: req.user.contacts,
    });
};

exports.complainUser = async(req, res) => {
    const com = new Complain(req.body);

    await com.save((err, doc) => {
        if (err) {
            console.log(err);
            return res.status(422).json({ errors: err })
        } else {
            const userData = {
                name: doc.name,
                enroll: doc.enroll,
                number: doc.number,
                type: doc.type,
                complain: doc.complain
            }
            return res.status(200).json({
                success: true,
                message: 'Successfully Signed Up',
                userData
            })
        }
    });
};