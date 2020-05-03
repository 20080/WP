const mongoose = require('mongoose');
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const carRoutes = require('./api/routes/cars');
const rentalRoutes = require('./api/routes/rentals');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://suraj:'+process.env.MONGO_ATLAS_PW+
'@node-rest-shop-ir7cz.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser :true,
    useUnifiedTopology: true});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//using below fun (middileware to handle CROS) by sending following header to the client.
app.use((req,resp,next)=>{
    resp.header("Access-Control-Allow-Origin","*");
    resp.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With, Content-Type, Accept, Authorization");//or just set to *
    if(req.method==='OPTIONS'){
        resp.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return resp.status(200).json({});
    }
    next();
});


// 
// 
// 
// MODULE SPACE WHICH I WILL CREATE SOON ENOUGH
app.use('/cars',carRoutes);
app.use('/rentals',rentalRoutes);
// 
// 
// 
// 



app.use((req,resp,next)=>{
    const error = new Error('Not found');
    error.status=404;
    next(error);
});

//we got extra pram as above we used next
app.use((error,req,resp,next)=>{
    resp.status(error.status||500);
    resp.json({
        error:{
            message: error.message
        }
    });
});



module.exports= app;
