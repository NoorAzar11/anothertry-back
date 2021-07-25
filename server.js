'use strict'


const express=require('express');
const cors=require('cors');
const axios=require('axios');
const dotenv=require('dotenv');

dotenv.config();

const PORT=process.env.PORT;

const app=express();
app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

const gameSchema = new mongoose.Schema({
    name: String,
    url:String,
  });

  const gameModal = mongoose.model('game', gameSchema);

app.get('/',(req,res)=>{
    res.status(200).send("Home Route ")
})

app.get('/getdata',(req,res)=>{
    const URL="https://pokeapi.co/api/v2/pokemon?offset=0&limit=20";
    axios.get(URL)
    .then(reslut=>{
        // console.log(reslut.data.results);
        res.status(200).send(reslut.data.results)
    })
    .catch((err)=>{
        console.log("try again",err)
    })
})


///////////////save data in db using post////

app.post('/addTofav',(req,res)=>{
    const {name,url}=req.body;
    const newObj=new gameModal({
        name:name,
        url:url,
    })
    newObj.save();
    res.status(200).send("obj has been added to db")
})
//////////// get data from db and send to front end //////

app.get('/display',(req,res)=>{
    gameModal.find({},(err,favData)=>{
        if(err){
            console.log("try again",err)
        }else{
            res.status(200).send(favData)
        }
    })
})

/////////////////////////////////////////////delete by id
app.delete('/delete/:id',(req,res)=>{
    const {id}=req.params;
    gameModal.findOneAndDelete({_id:id},(err,favData)=>{
        if(err){
            console.log("try again",err)
        }else {
            gameModal.find({},(err,favData)=>{
                res.status(200).send(favData)
            })
        }
    })
})

////////////////////////update using put ///////////

app.put('/update',(req,res)=>{
    const {name,url,id}=req.body;
    gameModal.findOne({_id:id},(err,favData)=>{
        if(err){
            console.log("try again",err)
        }else
        {
            favData.name=name;
            favData.url=url;
            favData.save() 
          .then(()=>{
              gameModal.find({},(err,favData)=>{
                res.status(200).send(favData)
              })
          })
        }
    })
})

app.listen(PORT,()=>{
    console.log(`Hello from the other side : ${PORT}`);
})
