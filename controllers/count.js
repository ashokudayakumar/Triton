const asyncMiddleware = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Count = require('../model/Count');

exports.createCount= asyncMiddleware(async (req,res,next)=>{
    
    req.body.vote_id =  req.params.id
    req.body.user  = req.user.id;
  
    const countid = await Count.findOne({user: req.user.id});

    if(countid && req.user.role === 'user'){
            return  next(new ErrorResponse(`Count add only one time `, 404));
    }

    const count = await Count.create(req.body);
    res.status(201).json({success:true, data:count})   
});
