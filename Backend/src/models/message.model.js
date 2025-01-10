import mongoose from "mongoose";
import { User } from "./user.model.js";
const messageSchema=new mongoose.Schema({
   senderId:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"User",
         required:true,
    },
    recieverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    text:{
        type:String,
        required:true,
    },
    image:{
        type:String,
    },
    video:{
        type:String,
    },
    file:{
        type:String,
    },

   } 
,{timestamps:true});
const Message=mongoose.model("Message",messageSchema);
export {Message};   