import { HydratedDocument, model, models, Schema, type InferSchemaType, type Types } from "mongoose";

import { applySoftDeleteQueryMiddleware } from "@/lib/soft-delete";

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productCode: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtTime: { type: Number, required: true, min: 0 }
  },
  { _id: false },
);

const deliveryDetailsSchema = new Schema(
  {
    recipientName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, default: "", trim: true },
    city: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true }
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    cartId: { type: Schema.Types.ObjectId, ref: "Cart", required: true },
    items: { type: [orderItemSchema], default: [] },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    deliveryDetails: { type: deliveryDetailsSchema, required: true },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered"],
      default: "confirmed"
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: String, default: null }
  },
  { timestamps: true },
);

applySoftDeleteQueryMiddleware(orderSchema);

export type Order = InferSchemaType<typeof orderSchema>;
export type OrderDocument = Order & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
export type OrderHydratedDocument = HydratedDocument<Order>;

export const OrderModel = models.Order || model<Order>("Order", orderSchema);
