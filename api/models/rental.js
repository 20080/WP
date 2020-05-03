const mongoose = require('mongoose');

const rentalSchema  = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    product:{type: mongoose.Schema.Types.ObjectId, ref:'Car',required:true}   //this is the relation b/w the order and the product routes

    ,quantity:{type: Number, default:1},
    status:{type:Boolean, default:true},
    userName:String,
    userPhone:Number,
    dateofIssue:Date,
    dateofReturn:Date

});

module.exports=mongoose.model('Rental',rentalSchema);