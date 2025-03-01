import { Request, Response } from "express";
import { APIError } from "../../utils/ApiError";
import { asyncHandler } from "../../utils/asyncHandler";
import { Product } from "../../models/Product.model";
import { ApiResponse } from "../../utils/ApiResponse";

const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const { category, sort } = req.query;

  const filter: any = {}; // Initialize empty filter

  if (category) {
    filter.category = category;
  }

  // Sorting logic
  let sortOption: any = {}; // Sorting object
  if (sort === "price_low") {
    sortOption.price = 1; // Ascending order (low to high)
  } else if (sort === "price_high") {
    sortOption.price = -1; // Descending order (high to low)
  } else if (sort === "newest") {
    sortOption.createdAt = -1; // Newest first
  }

  // Fetch products based on filter and sorting
  const products = await Product.find(filter).sort(sortOption);

  // If no products found
  if (!products.length) {
    throw new APIError(404, "No products found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        success: true,
        count: products.length,
        products,
      },
      "Products Found Successfully"
    )
  );
});

// Fetch a single product by ID
const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    throw new APIError(404, "Product not found");
  }
  res.status(200).json(new ApiResponse(200, product, "Product fetched"));
});

export { getAllProducts, getProductById };
