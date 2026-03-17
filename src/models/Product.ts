import { HydratedDocument, model, models, Schema, type InferSchemaType, type Types } from "mongoose";

import { applySoftDeleteQueryMiddleware } from "@/lib/soft-delete";

const productSchema = new Schema(
  {
    productId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    image: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stockQuantity: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: String, default: null }
  },
  { timestamps: true },
);

applySoftDeleteQueryMiddleware(productSchema);

export type Product = InferSchemaType<typeof productSchema>;
export type ProductDocument = Product & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
export type ProductHydratedDocument = HydratedDocument<Product>;

export const ProductModel = models.Product || model<Product>("Product", productSchema);
