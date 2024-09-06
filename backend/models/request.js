import mongoose, { Schema,model } from "mongoose";



const requestSchema = new Schema({
    sender:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    recevier:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        default:"pending",
        enum:["pending","accepted","rejected"]
    },



},{timestamps:true}) 

export const Request = mongoose.models.Request || model("Request",requestSchema)