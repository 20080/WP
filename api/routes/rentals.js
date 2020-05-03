const express = require('express');
const router = express.Router();//experss gives routes 1st route it is called product
const mongoose = require('mongoose');
const Rental = require('../models/rental');
const Car = require('../models/car');

router.get('/',(req,resp,next)=>{

    //handling  incoming  GET requests
        Rental.find()
        //.select('product quantity _id').
       // populate('product','name')
        .exec().then(docs=>{
            resp.status(200).json({
                count: docs.length,
                orders: docs.map(doc=>{
                    return{
                        _id: doc._id,
                        status: doc.status,
                        userName: doc.userName,
                        userPhone:doc.userPhone,
                        dateofIssue:dateofIssue,
                        dateofReturn:dateofReturn,
                        request:{
                            type:'GET',
                            url:'http://localhost:3000/rentals/'+doc._id
                        }
                    }
                })
            });
    
        }).catch(err=>{
            resp.status(500).json({
                error:err
            });
        });
     
     
        // resp.status(200).json({
        //     message:'Order was fetch'
        // });
    });






    router.post('/',(req,resp,next)=>{
        //checking we do have a product
        Car.findById(req.body.productId).then(product=>{
    
            if(!product){
                return resp.status(404).json({
                    message:'Product Not found'
                });
            }
    
            const rental = new Rental({
                _id:new mongoose.Types.ObjectId(),
                status:req.body.status,      
                userName: req.body.username,           
                userPhone: req.body.userPhone,
                dateofIssue: req.body.dateofIssue,//    
                dateofReturn: req.body.dateofReturn             
            });
          
                return rental.save()                    
         
            }).then(result=>{
            console.log(result);
            resp.status(201).json({
                message:'Order Stored',
                createdOrder:{
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request:{
                    type:'GET',
                    url:'http://localhost:3000/rentals/'+result._id
                }
            });
        }
    
        ).catch(err=>{
            console.log(err);
            resp.status(500).json({
                error:err
            });

        
        });
 
    
    });
    

    router.get('/:orderId',(req,resp,next)=>{
        
        Rental.findById(req.params.orderId)
       // .select("product quantity _id").
       // populate('product')
        .exec()
        .then(order=>{
            if(!order){
                return resp.status(404).json({message:"Order not found"});
            }
            resp.status(200).json({
                order:order,//argument we get form mongoose
                request:{
                    type:'GET',
                    url:"http://localhost:3000/rentals/"
                }
            });
        })
        .catch(err=>{
            resp.status(500).json({
                error:err
            });
        });
       
    });
    



    router.delete('/:orderId',(req,resp,next)=>{
        
        const bool = req.params.status;
        if(bool){
          return  resp.status(500).json({message:"Cant delete car is booked rn "})
        }
        Rental.remove({_id:req.params.orderId})
        .exec()
        .then(result=>{
            resp.status(200).json({
                message:"Order deleted",
                request:{
                    type:'POST',
                    url:"http://localhost:3000/orders/",
                    body:{
                        productId:'ID',quantity:'Number'
                    }
                }
            });

        })
         .catch(err=>{
            resp.status(500).json({
                error:err
            });
        });
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


module.exports= router;
