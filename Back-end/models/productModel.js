import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: (value) => value >= 0, // Enforce non-negative prices
        message: "Price must be non-negative",
      },
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      //description text for the product
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


const Product = mongoose.model("Product", productSchema);

export default Product;
