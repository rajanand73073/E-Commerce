
import mongoose, { Document, Schema } from "mongoose";



export interface ICategory extends Document {
    name: string;
    createdAt: Date;
  }
  
  const CategorySchema = new Schema<ICategory>({
    name: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
  });
  
  export const Category = mongoose.model<ICategory>("Category", CategorySchema);