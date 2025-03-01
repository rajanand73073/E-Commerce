import { Request } from "express";
import { Document } from "mongoose"; // If user is a Mongoose document
import {IUser} from "../models/User.model" // Import your User type

declare module "express" {
  export interface Request {
    user?: Document & IUser; // Adding `user` property
  }
}
