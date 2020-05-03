const express = require('express');
const router = express.Router();//experss gives routes 1st route it is called product
const mongoose = require('mongoose');
const Car = require('../models/car');


router.get('/',(req,resp,next)=>{

    Car.find()
    //.select('price name _id')               //limits the output
    .exec()
    .then(docs=>{

        const response ={                   //custom created docs 
            count: docs.length,
            products: docs.map(doc=>{
                return{
                    Model :doc.model,
                    VehicalNo: doc.vehicalNo,
                    _id: doc._id,
                    capacity:doc.capacity,
                    rent:doc.cost,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/cars/'+doc._id
                    }

                }
            })
        };
    console.log(docs);       
        resp.status(200).json(response)      
    }).catch(err=>{
        console.log(err);
        resp.status(500).json({error:err});
    });

});





router.post('/',(req,resp,next)=>{
  
    const car = new Car({
        
        _id: new mongoose.Types.ObjectId(),
        model: req.body.model,
        capacity: req.body.capacity,
        vehicalNo: req.body.vehicalNo,
        cost:req.body.cost

    });
    car.save().then(result=>{
        console.log(result);
        resp.status(201).json({
            message: 'Created car entry succesfully',
            createdCarEntry: {
                model: result.model,
                cost: result.cost,
                _id:result._id,
                vehicalNo:result.vehicalNo,
                request:{

                    type: 'GET',
                    url:'http://localhost:3000/cars/'+result._id

                }
            }
        });
    })
    .catch(err=>{
        console.log(err)
        resp.status(500).json({error:err});
    });

}); 








router.get('/:_id',(req,resp,next)=>{
    const model = req.params._id;

    Car.findById(model)
    //.select('name price _id')
    .exec()
    .then(doc=>{
        console.log('From database',doc);
       if(doc){
        resp.status(200).json({
         Cars: doc,

         request:{
             type:'GET',
             description:'Get all cars',
             url:'http://localhost:3000/cars/'
         }

        });
       }
       else{
           resp.status(404).json({message:'No valid model found for provided MODEL'});
       }

    })
    .catch(err=> {
        console.log(err);
        resp.status(500).json({error: err});
        })
    }); 


    router.patch('/:carId',(req,resp,next)=>{

        const id = req.params.carId;
        const bool = req.params.status;

        if(bool){
            return resp.status(500).json({
                message:'Cant Update Details car with id'+id+' is actively booked'
            });
        }

        const updateOps={};
        for(const ops of req.body){
            updateOps[ops.propName] = ops.value;
        }
        Car.update({_id:id}, {$set:updateOps}).exec().then(result=>{
            console.log(result);
    
    
            resp.status(200).json({
                message: 'Car details updated',
                request:{
                    type:'http://localhost:3000/cars/'+id
                }
            })
        }).catch(err=>{
            console.log(err);
            resp.status(500).json({
                error: err
            });
        });
      
    });


    router.delete('/:carId',(req,resp,next)=>{
        const id = req.params.carId;

        const bool = req.params.status;

        if(bool){
            return resp.status(500).json({
                message:'Cant Delete Details car with id'+id+' is actively booked'
            });
        }


        Car.remove({_id:id}).exec()
        .then(result=>{
            resp.status(200).json({
                message:'Entry deleted succesfully',
                type:'POST',
                url:'http://localhost:3000/cars/',
                body:{
                    name:"String",
                    price:"Number"
                }
            });
        })
        .catch(err=>{
            console.log(err);
            resp.status(500).json({
                error: err
            });
        });
    });
    
    module.exports= router;






