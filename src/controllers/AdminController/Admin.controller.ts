
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
      return { accessToken };
    } catch (error) {
      throw new APIError(
        500,
        "Something went wrong while generating refresh and access token"
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
  
    const createdAdmin = await User.findById(admin._id).select(
      "-password -refreshToken"
    );
    if (!createdAdmin) {
      throw new APIError(500, "Something went wrong");
    }
  
    return res
      .status(201)
      .json(new ApiResponse(200, createdAdmin, "Admin registered successfully"));
  });
  
  
   const adminLogin = asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;
      const admin = await User.findOne({ email, role: "admin" });
      if (!admin) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid admin credentials" });
      }
      const isPasswordValid = await admin.isPasswordCorrect(password);
      if (!isPasswordValid) {
        throw new APIError(404, "Invalid Password");
      }
  
      const token = generateToken(admin._id as String);
      res.status(200).json({ success: true, token });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error logging in as admin" });
    }
  });


  export {adminLogin,registerAdmin}