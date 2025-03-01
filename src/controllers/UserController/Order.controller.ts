import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { Order } from "../../models/Order.model";
import { ApiResponse } from "../../utils/ApiResponse";
import { APIError } from "../../utils/ApiError";
import { Product } from "../../models/Product.model";
import { VALID_STATUSES } from "../../constants";

interface OrderRequest extends Request {
  user?: any;
}

// Place an order
const placeOrder = asyncHandler(async (req: OrderRequest, res: Response) => {
  const { products } = req.body;
  const userId = req.user?._id;
  console.log("products", products);

  if (!products || products.length === 0) {
    throw new APIError(400, "Invalid order request");
  }

  let totalAmount = 0;

  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new APIError(404, `Product with ID ${item.product} not found`);
    }
    if (product.stock < item.quantity) {
      throw new APIError(400, `Not enough stock for product: ${product.name}`);
    }
    totalAmount += product.price * item.quantity;
  }

  const order = await Order.create({
    user: userId,
    items: products,
    totalAmount,
    status: "pending",
  });

  res.status(201).json({ message: "Order placed successfully", order });
});

// Fetch order history
const getOrderHistory = asyncHandler(
  async (req: OrderRequest, res: Response) => {
    const userId = req.user?._id;
    const orders = await Order.find({ user: userId }).populate(
      "products.product"
    );

    if (!orders.length) {
      throw new APIError(404, "No orders found");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, orders, "Orders History Successfully fetched")
      );
  }
);

// Update status values
const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params; // Get order ID from URL params
  const { status } = req.body;

  if (!VALID_STATUSES.includes(status)) {
    throw new APIError(400, "Invalid order status");
  }

  // Find and update order
  const order = await Order.findById(orderId);
  if (!order) {
    throw new APIError(404, "Order not found");
  }

  order.status = status; // Update status
  await order.save(); // Save changes

  res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated successfully"));
});

export { getOrderHistory, placeOrder, updateOrderStatus };
