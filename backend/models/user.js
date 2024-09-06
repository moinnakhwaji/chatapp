import { hash } from "bcrypt";
import mongoose, { model,  Schema, } from "mongoose";

const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select : false,
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },

        url:{
            type:String,
            required:true
        }
    }

},{timestamps:true})


UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
  
    this.password = await hash(this.password, 10);
  });
  
  export const User = mongoose.models.User || model("User", UserSchema);

