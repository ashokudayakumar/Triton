const asyncMiddleware = require('../middleware/async');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const ErrorResponse = require('../utils/errorResponse');
exports.protect = asyncMiddleware(async (req,res,next)=>{
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
//console.log(token);
    if(!token){
        return next(new ErrorResponse('not authorized user1', 401))
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await User.findById(decoded._id);
        next();
    }catch(err){
        return next(new ErrorResponse('not authorized user2', 401))
    }
})

exports.authorize = (...roles)=>{
   // console.log()
    return (req,res,next)=>{
        //console.log(req.user);
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse('not authorized user3', 401))
        }
        next();
    } 
}