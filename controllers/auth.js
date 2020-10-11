const asyncMiddleware = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../model/User');

exports.register = asyncMiddleware(async(req,res,next)=>{
//console.log(req.body);
    const {name,email,role, password} = req.body;
    if(!name || !email || !password){
        return next(new ErrorResponse('please fill all fields', 401));
    }
    const user = await User.create({
        name,
        email,
        password,
        role
    })
   sendTokenResponse(user,200,res);
})

exports.login = asyncMiddleware(async(req,res,next)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return next(new ErrorResponse('please fill all field', 401));
    }
    const user =await User.findOne({email});
    if(!user){
        return next(new ErrorResponse('invalid email id', 401));
    }
    const isMatch =await user.matchPassword(password);
    if(!isMatch){
        return next(new ErrorResponse('invalid password', 401));
    }
    sendTokenResponse(user,200,res);
})

const sendTokenResponse = (user,statusCode,res)=>{
  let token =  user.getSignedJwtToken();
  res.status(statusCode).json({
      _id:user.id,
      email:user.email,
      role:user.role,
      sucess:true,
      token
  })
}

exports.getme = asyncMiddleware(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        data:user
    })
})

