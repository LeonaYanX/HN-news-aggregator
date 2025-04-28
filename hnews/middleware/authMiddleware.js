const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { generateTokens } = require('../utils/token');
const RefreshToken = require('../models/refreshToken');
exports.verifyToken = (req,res,next)=>{
    const token = req.headers['authorization']?.split(' ')[1]; 
    if(!token){
        return res.status(403).json({error:'Token is required'});
    }
    try{
        const decoded = jwt.verify(token,jwtConfig.secretKey);
        // Decode the token and store the decoded user data on req.user to use it again then
        req.user=decoded;
        next();
    }catch(error){
        res.status(401).json({error:'Invalid token'});
    }
};


// token update function (If we need to extend the deadline)

exports.refreshToken = async (refreshT)=>{
    try{
    const storedToken = await RefreshToken.findOne({token: refreshT});
    if(!storedToken || storedToken.expiresAt<Date.now()){
        throw new Error('Refresh token is invalid or expired');
    }
    return generateTokens(storedToken.userId);
    }catch(err){
        console.log('Error in refreshToken authMiddleware');
        throw new Error('Failed to refresh token: User not found or token invalid');
    }
};
