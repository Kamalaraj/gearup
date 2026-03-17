import {
  type ProductDocument,
  type ProductHydratedDocument,
  ProductModel
} from "@/models/Product";

type ProductListParams = {
  page: number;
  limit: number;
  search: string;
  category: string;
  sortBy: "name" | "price" | "createdAt";
  sortOrder: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
};

export const productRepository = {
  create: async (payload: Record<string, unknown>): Promise<ProductHydratedDocument> =>
    ProductModel.create(payload),
  createMany: async (payload: Record<string, unknown>[]): Promise<ProductHydratedDocument[]> =>
    ProductModel.insertMany(payload),
  countAll: () => ProductModel.countDocuments({}),
  findById: async (id: string): Promise<ProductDocument | null> =>
    ProductModel.findById(id).lean<ProductDocument>(),
  findActiveByIds: async (ids: string[]): Promise<ProductDocument[]> =>
    ProductModel.find({ _id: { $in: ids }, isActive: true }).lean<ProductDocument[]>(),
  updateById: (id: string, payload: Record<string, unknown>) =>
    ProductModel.findByIdAndUpdate(id, payload, { new: true }).lean<ProductDocument>(),
  softDeleteById: (id: string, deletedBy?: string | null) =>
    ProductModel.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: deletedBy ?? null,
        isActive: false
      },
      { new: true },
    ).lean<ProductDocument>(),
  updateStock: (id: string, stockQuantity: number) =>
    ProductModel.findByIdAndUpdate(id, { stockQuantity }, { new: true }).lean<ProductDocument>(),
  list: async ({
    page,
    limit,
    search,
    category,
    sortBy,
    sortOrder,
    minPrice,
    maxPrice
  }: ProductListParams) => {
    const filter: Record<string, unknown> = { isActive: true };

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};

      if (minPrice !== undefined) {
        priceFilter.$gte = minPrice;
      }

      if (maxPrice !== undefined) {
        priceFilter.$lte = maxPrice;
      }

      filter.price = priceFilter;
    }

    const sortDirection = sortOrder === "asc" ? 1 : -1;

    const [data, total] = await Promise.all([
      ProductModel.find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<ProductDocument[]>(),
      ProductModel.countDocuments(filter)
    ]);

    return { data, total };
  },
  categories: async () => {
    const categories = await ProductModel.distinct("category", { isActive: true });
    return categories.sort();
  }
};
