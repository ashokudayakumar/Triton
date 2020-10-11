const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    },
    
    password:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
})
UserSchema.pre('save', async function(next){
    const salt =await bcrypt.genSalt(10);
    this.password =await bcrypt.hash(this.password, salt);
})

UserSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({_id:this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    })
}

UserSchema.methods.matchPassword = async function(enterPassword){
    return await bcrypt.compare(enterPassword,this.password);
}
module.exports = mongoose.model('User',UserSchema);