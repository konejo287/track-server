const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = mongoose.model('User');

router.post('/signup', async (req, res) => {
    console.log(req.body);

    const { email, password } = req.body;
    
    try {
        const user = new User({ email, password });
        const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
        await user.save();
        res.send({ token });
    }
    catch (err) {
        return res.status(422).send(err.message);
    }
    
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(422).send({ error: 'must provide email and password'})
    }

    const user = await User.findOne({ email: email });
    if(!user) {
        res.status(422).send({ error: 'invalid password or email'});
    }

    try {
        await user.comparePassword(password);
        const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
        res.send({ token, msg: "sucessfully loged in" })
    }
    catch (err) {
        return res.status(422).send({ error: 'invalid password or email'});
    }
    
});

module.exports = router;