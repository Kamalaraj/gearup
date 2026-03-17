import { HydratedDocument, model, models, Schema, type InferSchemaType, type Types } from "mongoose";

import { applySoftDeleteQueryMiddleware } from "@/lib/soft-delete";

const customerSchema = new Schema(
  {
    customerId: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, default: null },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: String, default: null }
  },
  { timestamps: true },
);

applySoftDeleteQueryMiddleware(customerSchema);

export type Customer = InferSchemaType<typeof customerSchema>;
export type CustomerDocument = Customer & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
export type CustomerHydratedDocument = HydratedDocument<Customer>;

export const CustomerModel =
  models.Customer || model<Customer>("Customer", customerSchema);
