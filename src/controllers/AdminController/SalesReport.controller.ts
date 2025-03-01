import { asyncHandler } from "../../utils/asyncHandler";
import { APIError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Order } from "../../models/Order.model";

const salesCategoryWise = asyncHandler(async (_req, res) => {
  const salesData = await Order.aggregate([
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    { $unwind: "$productInfo" },
    {
      $group: {
        _id: "$productInfo.category",
        totalSales: { $sum: "$items.quantity" },
      },
    },
  ]);
  res
    .status(200)
    .json(new ApiResponse(200, salesData, "Sales data fetched successfully"));
});

const topSellingProducts = asyncHandler(async (req, res) => {
  const topProducts = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        totalSold: { $sum: "$items.quantity" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 10 },
  ]);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        topProducts,
        "Top selling products fetched successfully"
      )
    );
});

const worstSellingProducts = asyncHandler(async (req, res) => {
  const worstProducts = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        totalSold: { $sum: "$items.quantity" },
      },
    },
    { $sort: { totalSold: 1 } },
    { $limit: 10 },
  ]);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        worstProducts,
        "Worst selling products fetched successfully"
      )
    );
});

export { salesCategoryWise, topSellingProducts, worstSellingProducts };
