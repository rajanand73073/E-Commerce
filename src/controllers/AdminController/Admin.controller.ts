
import { asyncHandler } from "../../utils/asyncHandler";
import { APIError } from "../../utils/ApiError";
import { User } from "../../models/User.model";
import { ApiResponse } from "../../utils/ApiResponse";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";



const generateToken = async (userId: String) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new APIError(404, "User not found");
      }
      const accessToken = user.generateToken();
      await user.save({ validateBeforeSave: false });
      return accessToken ;
    } catch (error) {
      throw new APIError(
        500,
        "Something went wrong while generatingtoken"
      );
    }
  };


const registerAdmin = asyncHandler(async (req, res) => {

    const { name, email, username, password } = req.body;
  
    if ([name, email, username, password].some((field) => field?.trim() === "")) {
      throw new APIError(400, "All fields are required");
    }
  
    const existedAdmin = await User.findOne({
      $or: [{ username }, { email }],
    });
  
    if (existedAdmin) {
      throw new APIError(409, "Admin with email or username already exists");
    }
  
    const admin = await User.create({
      name,
      email,
      password,
      username,
      role: "admin",
    });
  
    const createdAdmin = await User.findById(admin._id).select("-password ");
    if (!createdAdmin) {
      throw new APIError(500, "Something went wrong");
    }
  
    return res
      .status(201)
      .json(new ApiResponse(200, createdAdmin, "Admin registered successfully"));
});
  
  
   const adminLogin = asyncHandler(async (req, res) => {
      const { email, password } = req.body;
      
      const admin = await User.findOne({ email, role: "admin" });
      if (!admin) {
       throw new APIError(401,"admin not found")
      }
      const isPasswordValid = await admin.isPasswordCorrect(password);
      if (!isPasswordValid) {
        throw new APIError(404, "Invalid Password");
      }
      const Token = await generateToken(admin._id as String);

      const loggedInadmin = await User.findById(admin._id).select(
        "-password "
      );
    

      const options = {
        httpOnly: true,
        secure: true,
      };
      // when these two value will be stored as true  ,it means it only modified by server
    
      return res
        .status(200)
        .cookie("Token", Token,options)
        .json(
          new ApiResponse(      
            200,
            {
              admin: loggedInadmin,
              Token,
            },
            "Admin LoggedIn Successfully"
          )
        );
    
  });


  export {adminLogin,registerAdmin}