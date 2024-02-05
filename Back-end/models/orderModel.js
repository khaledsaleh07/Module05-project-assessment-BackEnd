import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // not required for now client said she may want it later on
      ref: "User",
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["CreditCard", "CashOnDelivery"],
      default: "CashOnDelivery",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveryCharge: {
      type: Number,
      required: true,
      default: 0,
    },
    deliveryAddress: {
      receiverName: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      building: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      addressDetails: {
        type: String,
      },
    },
    products: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
        },
      ],
      validate: {
        validator: function (products) {
          return products.length > 0;
        },
        message: "At least one product is required.",
      },
    },
  },
  { timestamps: true }
);

orderSchema.pre("find", function (next) {
  this.populate(["products.productId", "userId"]);
  next();
});

orderSchema.pre("findOne", function (next) {
  this.populate(["products.productId", "userId"]);
  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
