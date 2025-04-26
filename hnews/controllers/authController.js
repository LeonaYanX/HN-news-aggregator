const User = require('../models/User');
const bcrypt = require('bcrypt');
const {generateTokens} = require('../utils/token');
const RefreshToken = require('../models/refreshToken');

//registration of the user

exports.register = async (req,res)=>{

    try{
     const {username, email, password, role='guest'}= req.body;

    //IsExisting

    const existingUser = await User.findOne({ $or: [{username}, {email}] });
    if(existingUser){
        res.status(400).json({error: 'Username or email is already taken.'});
    }
     // new user creation
     
     const newUser = new User({username, email, password, role});
     await newUser.save();

     //res
     res.status(201).json({message: 'User registred successfully'});
}
catch(err){
    console.log('registration error' + err.message);
    res.status(500).json({error: 'Registration failed' });
}

};

exports.login = async(req,res)=>{
    try{
        const {username , password} = req.body;
        //finding user by username
     const user = await User.findOne({username});
     if(!user){
        return res.status(404).json({error: 'User is not found, register first.'});
     }
       // checking the password

       const isMatch = await user.comparePassword(password);
       if(!isMatch){
        return res.status(401).json({error: 'invalid credentials'});
       } 
       if(user.isBlocked){

        if(user.blockedUntil && user.blockedUntil> Date.now()){
        return res.status(403).json({ error: 'User is temporarily blocked.' });
        } else if (!user.blockedUntil) {
        return res.status(403).json({ error: 'User is permanently blocked.' });
        }
       
    }

       // generating both tokens first refresh

       const tokens = generateTokens(user.id);
       res.status(201).json({
        message: 'Successful login',
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken});
    }
    catch(err){
        console.log('Login failed' + err);
        res.status(500).json({error: 'Login failed'});
    }
};

exports.refreshAccessToken = async (res,req)=>{
    try{
        const { refreshToken } = req.body;
        if(!refreshToken){
            return res.status(400).json({message: 'Refresh token is required'});
        }

        const tokenDoc = await RefreshToken.findOne({token: refreshToken});
        if (!tokenDoc || tokenDoc.expiresAt < Date.now()){
            return res.status(403).json({message: 'Refresh token is expired or invalid'});
        }
        // new tokens generation

    const tokens = generateTokens(tokenDoc.userId);
    res.status(200).json({
        message: 'Token refreshed',
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });

    }catch(err){
        console.error('Refresh access token error:', err);
    res.status(500).json({ error: 'Failed to refresh token' });
    }
};

// logaout and deleting refresh token
exports.logout = async (req, res)=>{

    try{
        const { refreshToken } = req.body;
        if(!refreshToken){
            return res.status(400).json({message: 'Refresh token required.'});
        }
        await RefreshToken.deleteOne({token: refreshToken});
        res.status(201).json({message: 'Logged out successfully.'});
    }catch(err){
        console.log('Logout error' + err);
        res.status(500).json({error: 'Logout failed.'});
    }
};