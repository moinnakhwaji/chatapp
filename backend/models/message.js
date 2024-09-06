import mongoose, { model, Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    content: {
      type: String,
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    attachments:[{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }]
  },
  { timestamps: true }
);



export const Message = mongoose.model.Message || model("Message",MessageSchema)

