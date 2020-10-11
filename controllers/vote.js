const asyncMiddleware = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Vote = require('../model/Vote');
exports.getVotes = asyncMiddleware(async(req,res,next)=>{
    let query;
    //copy req.query
     const reqQuery = { ...req.query };
     //console.log(reqQuery);

     //fields to exclude
     const removeFields = ['select','sort','page','limit'];

     //loop over removeFields and delete from them reqQuery
     removeFields.forEach( params => delete reqQuery[params]);
    
     //create query string
     let queryStr = JSON.stringify(reqQuery);
     //console.log(queryStr);

    //create operator $gt
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);
    //console.log(queryStr);
      //finding resource
     query = Vote.find(JSON.parse(queryStr));
     //console.log(query);
     //select Fields
     if(req.query.select){
             const fields = req.query.select.split(',').join(' ');
             query = query.select(fields);
     }

     //sort Field
     if(req.query.sort){
             const sortBy =  req.query.sort.split(',').join(' ');
             query = query.sort(sortBy);
     }else{
             query = query.sort('-createdAt');
     }
     //console.log(query);
     const page = parseInt(req.query.page, 10) || 1;
     const limit =  parseInt(req.query.limit, 10) || 10;
     const startIndex = (page-1)*limit;
     const endIndex = page*limit;
     const total =await Vote.countDocuments();
     const pagecount = total/limit;
     const pageLength = pagecount.toFixed();
     query = query.skip(startIndex).limit(limit);
     
     //executive query
     const vote = await query;
     //console.log(blog);
     //pagination 
     const pagination = {};
     if(endIndex < total){
             pagination.next = {
              page: page + 1,
             limit
     }
     }
     if(startIndex > 0){
             pagination.prev = {
             page:page - 1,
             limit
             }
     }

    res.status(200).json({success:true,totalRecords:total,pageLength, count:vote.length, pagination, vote:vote})

})
exports.getVote = asyncMiddleware(async(req,res,next)=>{
    const vote =await Vote.findById(req.params.id);
    if(!vote){
        return next(new ErrorResponse('Invalid Vote id', 401))
    }
    res.status(200).json({
        sucess:true,
        vote
    })
})
exports.createVote =  asyncMiddleware(async(req,res,next)=>{
    const {name } = req.body;
    if(!name ){
        return next(new ErrorResponse('Enter All Field', 404))
    }
    const vote =await Vote.create({
        name,
    })
    
    res.status(200).json({
        sucess:true,
        vote
    })
})

exports.updateVote = asyncMiddleware(async(req,res,next)=>{
    let vote =await Vote.findById(req.params.id);
    if(!vote){
        return next(new ErrorResponse('Invalid Vote id', 401))
    }
    vote =await Vote.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })

    res.status(200).json({
        sucess:true,
        vote
    })
})

exports.deleteVote = asyncMiddleware(async(req,res,next)=>{
    let vote =await Vote.findById(req.params.id);
    if(!vote){
        return next(new ErrorResponse('Invalid Vote id', 401))
    }
    vote =await vote.remove();
    res.status(200).json({
        sucess:true,
        vote:{}
    })
})