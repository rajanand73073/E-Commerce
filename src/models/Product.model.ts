import mongoose, { Document, Schema } from "mongoose";
export interface IProduct extends Document {
    name: string;
    price: number;
    category: mongoose.Schema.Types.ObjectId;
    stock: number;
    createdAt: Date;
  }
  
  const ProductSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    stock: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  
  export const Product = mongoose.model<IProduct>("Product", ProductSchema);