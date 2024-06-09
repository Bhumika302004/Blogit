const mongoose=require('mongoose');

const postschema=new mongoose.Schema({
    imagetext:{
       type:String,
       required:true, 
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    image:{
             type:String
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    likes:{
        type:Array,
        default:[],
    },
});

module.exports=mongoose.model('Post',postschema);