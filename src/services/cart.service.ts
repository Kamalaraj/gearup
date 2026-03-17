import { randomUUID } from "crypto";

import { generatePrefixedSequenceId } from "@/lib/sequence";
import { seqIdConstants } from "@/constants/seqIdConstants";
import { cartRepository } from "@/repositories/cart.repository";
import { productRepository } from "@/repositories/product.repository";

function calculateTotal(
  items: Array<{ quantity: number; priceAtTime: number; isDeleted?: boolean }>,
) {
  return items
    .filter((item) => !item.isDeleted)
    .reduce((total, item) => total + item.quantity * item.priceAtTime, 0);
}

async function getActiveCartDocument(cartMongoId: string) {
  const cart = await cartRepository.findHydratedById(cartMongoId);

  if (!cart || cart.status !== "active") {
    throw new Error("Cart not found.");
  }

  return cart;
}

export const cartService = {
  getActiveCart(customerId: string) {
    return cartRepository.findLeanActiveByCustomerId(customerId);
  },

  async addItem(input: { customerId: string; productId: string; quantity: number }) {
    if (input.quantity < 1) {
      throw new Error("Quantity must be at least 1.");
    }

    const product = await productRepository.findById(input.productId);

    if (!product || !product.isActive || product.isDeleted) {
      throw new Error("Product not found.");
    }

    if (product.stockQuantity < input.quantity) {
      throw new Error("Requested quantity exceeds stock.");
    }

    let cart = await cartRepository.findActiveByCustomerId(input.customerId);

    if (!cart) {
      const cartId = await generatePrefixedSequenceId(seqIdConstants.CART);
      cart = await cartRepository.create({
        cartId,
        customerId: input.customerId,
        items: [],
        totalAmount: 0,
        status: "active"
      });
    }

    const existingItem = cart.items.find((item) => item.productId.toString() === input.productId);

    if (existingItem) {
      const nextQuantity = (existingItem.isDeleted ? 0 : existingItem.quantity) + input.quantity;

      if (nextQuantity > product.stockQuantity) {
        throw new Error("Requested quantity exceeds stock.");
      }

      existingItem.isDeleted = false;
      existingItem.quantity = nextQuantity;
      existingItem.priceAtTime = product.price;
      existingItem.image = product.image;
      existingItem.name = product.name;
      existingItem.productCode = product.productId;
    } else {
      cart.items.push({
        itemId: randomUUID(),
        productId: product._id,
        productCode: product.productId,
        name: product.name,
        image: product.image,
        quantity: input.quantity,
        priceAtTime: product.price,
        isDeleted: false
      });
    }

    cart.totalAmount = calculateTotal(cart.items);
    await cart.save();

    return cart.toObject();
  },

  async updateItemQuantity(cartMongoId: string, itemId: string, quantity: number) {
    if (quantity < 1) {
      throw new Error("Quantity must be at least 1.");
    }

    const cart = await getActiveCartDocument(cartMongoId);

    const item = cart.items.find((entry) => entry.itemId === itemId && !entry.isDeleted);

    if (!item) {
      throw new Error("Cart item not found.");
    }

    const product = await productRepository.findById(item.productId.toString());

    if (!product || product.isDeleted || quantity > product.stockQuantity) {
      throw new Error("Requested quantity exceeds stock.");
    }

    item.quantity = quantity;
    item.priceAtTime = product.price;
    cart.totalAmount = calculateTotal(cart.items);
    await cart.save();

    return cart.toObject();
  },

  async softRemoveItem(cartMongoId: string, itemId: string) {
    const cart = await getActiveCartDocument(cartMongoId);

    const item = cart.items.find((entry) => entry.itemId === itemId && !entry.isDeleted);

    if (!item) {
      throw new Error("Cart item not found.");
    }

    item.isDeleted = true;
    cart.totalAmount = calculateTotal(cart.items);
    await cart.save();

    return cart.toObject();
  }
};
