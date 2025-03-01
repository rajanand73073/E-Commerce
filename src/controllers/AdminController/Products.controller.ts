import { asyncHandler } from "../../utils/asyncHandler";
import { APIError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Category } from "../../models/Category.model";
import { Product } from "../../models/Product.model";

const addProduct = asyncHandler(async (req, res) => {
  const { name, price, category, stock } = req.body;
  const product = await Product.create({ name, price, category, stock });
  res
    .status(201)
    .json(new ApiResponse(201, product, "Product added successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, price, category, stock } = req.body;
  const product = await Product.findByIdAndUpdate(
    id,
    { name, price, category, stock },
    { new: true }
  );
  res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully"));
});

const listProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find().populate("category");
  res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

export { addProduct, updateProduct, deleteProduct, listProducts };
