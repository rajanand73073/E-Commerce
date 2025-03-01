import { Request, Response, NextFunction } from "express";
import { APIError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model";



interface DecodedToken {
  _id: string;
  role: string;
}

interface AuthRequest extends Request {
  user?: any;
  admin?: any;
}

export const verifyJWTUser = asyncHandler(
  async (req: AuthRequest, _: Response, next: NextFunction) => {
    try {
      let Token = req.cookies?.Token || req.header("Authorization")?.replace("Bearer ", "");


      if (!Token) {
        throw new APIError(401, "Unauthorized request");
      }

      const decodedToken = jwt.verify(
        Token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as DecodedToken;

      const user = await User.findById(decodedToken._id).select(
        "-password "
      );

      if (!user) {
        throw new APIError(401, "Invalid Access Token");
      }

      req.user = user; // Attach user data to the request
      next(); // Pass control to the next middleware or route handler
    } catch (error) {
      const err = error as Error;
      throw new APIError(401, err.message || "Invalid access token");
    }
  }
);

export const verifyJWTAdmin = asyncHandler(
  async (req: AuthRequest, _: Response, next: NextFunction) => {
    try {
      console.log("Raw Token:", req.cookies?.Token);

      let Token = req.cookies?.Token || req.header("Authorization")?.replace("Bearer ", "");

      if (!Token) {
        throw new APIError(401, "Unauthorized request - Token not provided");
      }

      // Decode the token in case it's URL-encoded
      Token = decodeURIComponent(Token);
      console.log("Decoded Admin Token:", Token); // Debugging log

      
      const decodedToken = jwt.verify(
        Token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as DecodedToken;


      console.log("decodedToken",decodedToken);
      
      const admin = await User.findById(decodedToken._id).select("-password");

      if (!admin) {
        throw new APIError(401, "Invalid Access Token");
      }

      req.admin = admin; // Attach admin data to the request
      next(); // Pass control to the next middleware or route handler
    } catch (error) {
      const err = error as Error;
      throw new APIError(401, err.message || "Invalid access token");
    }
  }
);
