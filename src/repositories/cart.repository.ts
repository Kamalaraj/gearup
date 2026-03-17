import {
  type CartDocument,
  type CartHydratedDocument,
  CartModel
} from "@/models/Cart";

export const cartRepository = {
  create: async (payload: Record<string, unknown>): Promise<CartHydratedDocument> =>
    CartModel.create(payload),
  findById: async (id: string): Promise<CartDocument | null> =>
    CartModel.findById(id).lean<CartDocument>(),
  findHydratedById: async (id: string): Promise<CartHydratedDocument | null> =>
    CartModel.findById(id),
  findActiveByCustomerId: async (customerId: string): Promise<CartHydratedDocument | null> =>
    CartModel.findOne({ customerId, status: "active" }),
  findLeanActiveByCustomerId: async (customerId: string): Promise<CartDocument | null> =>
    CartModel.findOne({ customerId, status: "active" }).lean<CartDocument>(),
  updateStatus: (id: string, status: "active" | "checked_out" | "abandoned") =>
    CartModel.findByIdAndUpdate(id, { status }, { new: true }).lean<CartDocument>()
};
