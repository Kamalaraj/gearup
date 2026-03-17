import {
  type CustomerDocument,
  type CustomerHydratedDocument,
  CustomerModel
} from "@/models/Customer";

export const customerRepository = {
  create: async (payload: Record<string, unknown>): Promise<CustomerHydratedDocument> =>
    CustomerModel.create(payload),
  findById: async (id: string): Promise<CustomerDocument | null> =>
    CustomerModel.findById(id).lean<CustomerDocument>(),
  findByEmail: async (email: string): Promise<CustomerDocument | null> =>
    CustomerModel.findOne({ email }).lean<CustomerDocument>(),
  findByEmailHydrated: async (email: string): Promise<CustomerHydratedDocument | null> =>
    CustomerModel.findOne({ email }),
  updateById: (id: string, payload: Record<string, unknown>) =>
    CustomerModel.findByIdAndUpdate(id, payload, { new: true }).lean<CustomerDocument>(),
  list: async (search: string, page: number, limit: number) => {
    const filter = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
          ]
        }
      : {};

    const [data, total] = await Promise.all([
      CustomerModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<CustomerDocument[]>(),
      CustomerModel.countDocuments(filter)
    ]);

    return { data, total };
  }
};
