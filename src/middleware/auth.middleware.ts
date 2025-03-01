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
}

export const verifyJWT = asyncHandler(
  async (req: AuthRequest, _: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        throw new APIError(401, "Unauthorized request");
      }

      const decodedToken = jwt.verify(
        token,
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
