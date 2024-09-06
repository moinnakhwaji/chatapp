import jwt from "jsonwebtoken";
import { TryCatch } from "./error.js";
import { CHATTU_TOKEN } from "../constant/config.js";
import { ErrorHandler } from "../utils/utility.js";
import { User } from "../models/user.js";

const isAuthenticated = TryCatch(async (req, res, next) => {
  const token = req.cookies[CHATTU_TOKEN];

  if (!token) return res.status(400).json({ msg: "Please login first" });
  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedData._id;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid token" });
  }
});

const adminoOnly = TryCatch(async (req, res, next) => {
  const token = req.cookies["chattu-admin-token"];

  if (!token)
    return next(new ErrorHandler("Only Admin can access this route", 401));

  const secretKey = jwt.verify(token, process.env.JWT_SECRET);

  const isMatched = secretKey === adminSecretKey;

  if (!isMatched)
    return next(new ErrorHandler("Only Admin can access this route", 401));

  next();
});

const socketAuthenticator = async (err, socket, next) => {
  try {
    const authToken = socket.request.cookies[CHATTU_TOKEN];
    console.log(CHATTU_TOKEN)
    console.log("Auth Token:", authToken);

    if (!authToken){
      return next(new ErrorHandler("Please login to access this route", 401));
    }
    const decodedData = jwt.verify(authToken,process.env.JWT_SECRET);
    console.log("Decoded Data:", decodedData); 

const user = await User.findById(decodedData._id);
console.log("User:", user);

    if (!user)
      return next(new ErrorHandler("Please login to access this route", 401));

    socket.user = user;

    return next();
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Please login to access this route", 401));
  }
};

export { isAuthenticated, adminoOnly, socketAuthenticator };
