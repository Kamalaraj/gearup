import { FilterQuery } from "mongoose";

import {
  type OrderDocument,
  type OrderHydratedDocument,
  OrderModel
} from "@/models/Order";

export const orderRepository = {
  create: async (payload: Record<string, unknown>): Promise<OrderHydratedDocument> =>
    OrderModel.create(payload),
  findById: async (id: string): Promise<OrderDocument | null> =>
    OrderModel.findById(id).lean<OrderDocument>(),
  list: async (params: {
    page: number;
    limit: number;
    status: string;
    customerId?: string;
    search: string;
  }) => {
    const filter: FilterQuery<OrderDocument> = {};

    if (params.status) {
      filter.orderStatus = params.status;
    }

    if (params.customerId) {
      filter.customerId = params.customerId;
    }

    if (params.search) {
      filter.orderId = { $regex: params.search, $options: "i" };
    }

    const [data, total] = await Promise.all([
      OrderModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((params.page - 1) * params.limit)
        .limit(params.limit)
        .lean<OrderDocument[]>(),
      OrderModel.countDocuments(filter)
    ]);

    return { data, total };
  }
};
