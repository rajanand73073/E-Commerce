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

const registerUser = asyncHandler(async (req, res) => {
  //step1:getting userDetails  from frontend
  //validation -nothing empty
  //check if user is already exist:username,email
  //create userObject-create entry in db
  //remove password and  token field from response
  //check for user creation
  //return res

  const { name, email, username, password } = req.body;
  console.log("email", email);

  if ([name, email, username, password].some((field) => field?.trim() === "")) {
    throw new APIError(400, "All fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  console.log("user", existedUser);

  console.log("Request body:", req.body);

  if (existedUser) {
    throw new APIError(409, "User With email or Username already exist");
  }
  const user = await User.create({
    name,
    email,
    password,
    username: username,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new APIError(500, "something Went wrong");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Succesfully"));
});


const loginUser = asyncHandler(async (req, res) => {
  // steps to be performed when login
  //1.validate Username or email
  //2.validate password
  //3.Then generate tokens
  // send cookies & respond successfuly loggedin
  const { email, username, password } = req.body;
  console.log("req.body:", req.body);

  if (!(username || email)) {
    throw new APIError(400, "Username or email is required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new APIError(404, "User doesnot exist");
  }
  console.log(user);

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new APIError(404, "Invalid Password");
  }

  const Token = await generateToken(user._id as String);
  console.log(Token);

  const loggedInuser = await User.findById(user._id).select(
    "-password "
  );

  console.log(loggedInuser);
  console.log("Headers:", req.headers);

  const options = {
    httpOnly: true,
    secure: true,
  };
  // when these two value will be stored as true  ,it means it only modified by server

  return res
    .status(200)
    .cookie("accessToken", Token)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInuser,
          Token,
        },
        "User LoggedIn Successfully"
      )
    );
});


export { registerUser,loginUser };
