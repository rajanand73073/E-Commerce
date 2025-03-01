import { asyncHandler } from "../../utils/asyncHandler";
import { APIError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Category } from "../../models/Category.model";

const manageCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await Category.create({ name });
  res
    .status(201)
    .json(new ApiResponse(201, category, "Category added successfully"));
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await Category.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );
  res
    .status(200)
    .json(new ApiResponse(200, category, "Category updated successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json(new ApiResponse(200, null, "Category deleted successfully"));
});

const listCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

export { manageCategory, updateCategory, deleteCategory, listCategories };
