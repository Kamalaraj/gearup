import { generatePrefixedSequenceId } from "@/lib/sequence";
import { productRepository } from "@/repositories/product.repository";
import { seqIdConstants } from "@/constants/seqIdConstants";
import { ProductFormValues, ProductSeedInput } from "@/schemas/product.schema";

function buildPaginationResult<T>(data: T[], total: number, page: number, limit: number) {
  return {
    data,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1
  };
}

export const productService = {
  async createProduct(input: ProductFormValues) {
    const productId = await generatePrefixedSequenceId(seqIdConstants.PRODUCT);

    return productRepository.create({
      ...input,
      productId
    });
  },
  getProductById(id: string) {
    return productRepository.findById(id);
  },
  async updateProduct(id: string, input: ProductFormValues) {
    return productRepository.updateById(id, input);
  },
  async softDeleteProduct(id: string, deletedBy?: string | null) {
    return productRepository.softDeleteById(id, deletedBy);
  },
  async listProducts(input: {
    page: number;
    limit: number;
    search: string;
    category: string;
    sortBy: "name" | "price" | "createdAt";
    sortOrder: "asc" | "desc";
    minPrice?: number;
    maxPrice?: number;
  }) {
    const { data, total } = await productRepository.list(input);
    const categories = await productRepository.categories();

    return {
      ...buildPaginationResult(data, total, input.page, input.limit),
      categories
    };
  },
  findByIds(ids: string[]) {
    return productRepository.findActiveByIds(ids);
  },
  async seedProducts(products: ProductSeedInput[]) {
    const currentCount = await productRepository.countAll();

    if (currentCount > 0) {
      return { insertedCount: 0, skipped: true };
    }

    const payload = await Promise.all(
      products.map(async (product) => ({
        ...product,
        productId: await generatePrefixedSequenceId(seqIdConstants.PRODUCT)
      })),
    );

    await productRepository.createMany(payload);

    return { insertedCount: payload.length, skipped: false };
  }
};
