import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
    user: mongoose.Schema.Types.ObjectId;
    items: Array<{ product: mongoose.Schema.Types.ObjectId; quantity: number }>;
    totalAmount: number;
    status: "pending" | "shipped" | "delivered" | "cancelled";
    createdAt: Date;
  }
  
  const OrderSchema = new Schema<IOrder>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "shipped", "delivered", "cancelled"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
  });
  
  export const Order = mongoose.model<IOrder>("Order", OrderSchema);