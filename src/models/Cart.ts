import { HydratedDocument, model, models, Schema, type InferSchemaType, type Types } from "mongoose";

import { applySoftDeleteQueryMiddleware } from "@/lib/soft-delete";

const cartItemSchema = new Schema(
  {
    itemId: { type: String, required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productCode: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtTime: { type: Number, required: true, min: 0 },
    isDeleted: { type: Boolean, default: false }
  },
  { _id: false },
);

const cartSchema = new Schema(
  {
    cartId: { type: String, required: true, unique: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    items: { type: [cartItemSchema], default: [] },
    totalAmount: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["active", "checked_out", "abandoned"],
      default: "active"
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: String, default: null }
  },
  { timestamps: true },
);

applySoftDeleteQueryMiddleware(cartSchema);

export type Cart = InferSchemaType<typeof cartSchema>;
export type CartItem = InferSchemaType<typeof cartItemSchema>;
export type CartDocument = Cart & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
export type CartItemDocument = CartItem;
export type CartHydratedDocument = HydratedDocument<Cart>;

export const CartModel = models.Cart || model<Cart>("Cart", cartSchema);
