const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');

const router = express.Router();


router.post('/register', async(req, res) => {
    
    
    const { email } = req.body;


    try{

        if(await User.findOne({email})){
            return res.status(400).send({error: 'User already existis'});    
        }

        const user = await User.create(req.body);
        user.password = undefined;

        return res.status(200).send({
            user,
            token: generateToken({id: user.id}),
        });
    }catch(err){
        return res.status(400).send({error: 'Registration failed'});
    }
});

router.post('/authenticate', async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email}).select('+password');

    if(!user)
        return res.status(400).send({error : 'User not fount'});

    if( !await bcrypt.compare(password, user.password))
        return res.status(400).send({error : 'Invalide password'});

    user.password = undefined;

    return res.send({
        user,
        token: generateToken({id: user.id}),
    });
});

function generateToken(params = {}){
    return jwt.sign({params}, authConfig.secret, {
        expiresIn: 86400    
    });
}

module.exports = app => app.use('/auth', router);