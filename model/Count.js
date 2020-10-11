const mongoose = require('mongoose');
const CountSchema =  new mongoose.Schema({
    vote_id: {
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }

})

module.exports = mongoose.model('Count', CountSchema);