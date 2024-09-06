import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import {getBase64,getSockets} from "../lib/helper.js"

dotenv.config({
    path: "./.env"
});

// Get the MongoDB connection URL from the environment variables
const db = process.env.MONGO_URL;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(db, {
            
        });
     
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Event listeners for more insight
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.log(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from DB');
});


const cookieOption = {
  maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  sameSite: "none", // Ensure your site uses HTTPS
  httpOnly: true, // Prevent JavaScript access
  secure: true,   // Ensure HTTPS
};

const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '15d' });
  return res.status(code)
    .cookie("chattu-token", token, cookieOption)
    .json({ success: true, user, message });
};





const emitEvent = (req, event, users, data) => {
    const io = req.app.get("io");
    const usersSocket = getSockets(users);
    io.to(usersSocket).emit(event, data);
  };

  const uploadFilesToCloudinary = async (files = []) => {
    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          getBase64(file),
          {
            resource_type: "auto",
            public_id: uuid(),
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
      });
    });
  
    try {
      const results = await Promise.all(uploadPromises);
  
      const formattedResults = results.map((result) => ({
        public_id: result.public_id,
        url: result.secure_url,
      }));
      return formattedResults;
    } catch (err) {
      throw new Error("Error uploading files to cloudinary", err);
    }
  };
  
const DeleteFilesFromCloudinary = async (public_ids)=>{

}

export { connectDB, sendToken, cookieOption,emitEvent,DeleteFilesFromCloudinary,uploadFilesToCloudinary };
