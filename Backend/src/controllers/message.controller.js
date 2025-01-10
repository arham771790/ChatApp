
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
 const getUsersforSidebar=asyncHandler(async(req,res)=>{
    try{
        const loggedInUser=req.user._id;
        const filteredUser=await User.find({_id:{$ne:loggedInUser}}).select("-password");// Get all users except the logged in user and select all fields except password
        res.status(200).json({success:true,users:filteredUser});
    }
    catch(error)
    {
        console.log("Error in getUsersforSidebar",error);
        throw new ApiError(500,"Internal Server Error");
    }
});// Get all users for sidebar
const getMessages=asyncHandler(async(req,res)=>{
    try{
    const {id:usertoChatId}=req.params;
    const myId=user._id;
    const messages=await Message.find({
        $or:[
            {senderId:myId,recieverId:usertoChatId},
            {senderId:usertoChatId,recieverId:myId},
        ]
    }).sort("createdAt");// Get all messages between two users ie me and the other user and sort them by createdAt
    res.status(200).json({success:true,messages});
    }catch(error){
        console.log("Error in getMessages",error);
        throw new ApiError(500,"Internal Server Error");
    }
});// Get all messages between two users
const sendMessage=asyncHandler(async(req,res)=>{
    try{const {id:recieverId}=req.params;// Get the recieverId from the URL params
    const {text,image,video,file}=req.body;// Get the text,image,video and file from the request body
    let imageUrl,videoUrl,fileUrl;
    if(image)
    {
        const uploadResponse=await uploadonCloudinary(image);// Upload the image to cloudinary
        imageUrl=uploadResponse.secure_url;// Get the secure url of the uploaded image
    }
    if(video)
    {
        const uploadResponse=await uploadonCloudinary(video);// Upload the video to cloudinary
        videoUrl=uploadResponse.secure_url;// Get the secure url of the uploaded video
    }
    if(file)
    {
        const uploadResponse=await uploadonCloudinary(file);// Upload the file to cloudinary
        fileUrl=uploadResponse.secure_url;// Get the secure url of the uploaded file
    }
    const newMessage=new Message({
        senderId,recieverId,text,image:imageUrl,video:videoUrl,file:fileUrl
    });
    await newMessage.save();// Save the new message to the database 
    //todo : realtime functionality using socket.io to send the message to the reciever 
    res.status(201).json({success:true,message:newMessage});
}catch(error)
{
    console.log("Error in sendMessage",error);
    throw new ApiError(500,"Internal Server Error");
}
});// Send a message
export {getUsersforSidebar,getMessages,sendMessage};