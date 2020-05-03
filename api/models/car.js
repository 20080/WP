const mongoose = require('mongoose');

const carSchema  = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    vehicalNo: {type: String,required:true},
    model:{type: String,required:true},
    capacity:{type: Number,required:true},
    cost:{type: Number,required:true},
    status:{type:Boolean, ref:'Rental'}


});
carSchema.index({'$**': 'text'});

module.exports=mongoose.model('Car',carSchema);