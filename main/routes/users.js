var express = require('express');
var router = express.Router();
const mongoose =require("mongoose");

const p=require("passport-local-mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/pinterest_db");
const userschema=new mongoose.Schema({
  username:{
      type:String,
      requires:true,
      unique:true,
  },
  password:{
    type:String,
  },
  posts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Post',
  }
  ],
  dp:{
    type:String,
  },
  email:{
      type:String,
      required:true,
      unique:true,
  },
  fullName:{
    type:String,
    required:true,
  },
});
userschema.plugin(p);
module.exports=mongoose.model("user",userschema);



