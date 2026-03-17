import { Types } from "mongoose";

import { generatePrefixedSequenceId } from "@/lib/sequence";
import { sendOrderConfirmationEmail } from "@/lib/mail";
import { seqIdConstants } from "@/constants/seqIdConstants";
import { cartRepository } from "@/repositories/cart.repository";
import { customerRepository } from "@/repositories/customer.repository";
import { orderRepository } from "@/repositories/order.repository";
import { productRepository } from "@/repositories/product.repository";

const DELIVERY_FEE = 25;

function buildPaginationResult<T>(data: T[], total: number, page: number, limit: number) {
  return {
    data,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1
  };
}

export const orderService = {
  async createOrder(input: {
    customerId: string;
    cartId: string;
    email: string;
    deliveryDetails: {
      recipientName: string;
      phone: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      postalCode: string;
    };
  }) {
    const [customer, cart] = await Promise.all([
      customerRepository.findById(input.customerId),
      cartRepository.findById(input.cartId)
    ]);

    if (!customer) {
      throw new Error("Customer not found.");
    }

    if (!cart || cart.status !== "active") {
      throw new Error("Active cart not found.");
    }

    if (cart.customerId.toString() !== input.customerId) {
      throw new Error("Cart does not belong to this customer.");
    }

    const activeItems = cart.items.filter((item) => !item.isDeleted);

    if (!activeItems.length) {
      throw new Error("Cart is empty.");
    }

    const productIds = activeItems.map((item) => item.productId.toString());
    const products = await productRepository.findActiveByIds(productIds);
    const productMap = new Map(products.map((product) => [product._id.toString(), product]));

    for (const item of activeItems) {
      const product = productMap.get(item.productId.toString());

      if (!product || product.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for ${item.name}.`);
      }
    }

    for (const item of activeItems) {
      const product = productMap.get(item.productId.toString());

      if (product) {
        await productRepository.updateStock(product._id.toString(), product.stockQuantity - item.quantity);
      }
    }

    const subtotal = activeItems.reduce(
      (total, item) => total + item.quantity * item.priceAtTime,
      0,
    );
    const totalAmount = subtotal + DELIVERY_FEE;
    const orderId = await generatePrefixedSequenceId(seqIdConstants.ORDER);

    const order = await orderRepository.create({
      orderId,
      customerId: new Types.ObjectId(input.customerId),
      cartId: new Types.ObjectId(input.cartId),
      items: activeItems.map((item) => ({
        productId: item.productId,
        productCode: item.productCode,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        priceAtTime: item.priceAtTime
      })),
      subtotal,
      deliveryFee: DELIVERY_FEE,
      totalAmount,
      deliveryDetails: {
        recipientName: input.deliveryDetails.recipientName,
        phone: input.deliveryDetails.phone,
        addressLine1: input.deliveryDetails.addressLine1,
        addressLine2: input.deliveryDetails.addressLine2 ?? "",
        city: input.deliveryDetails.city,
        postalCode: input.deliveryDetails.postalCode
      },
      orderStatus: "confirmed"
    });

    await cartRepository.updateStatus(cart._id.toString(), "checked_out");

    const deliveryAddress = [
      input.deliveryDetails.addressLine1,
      input.deliveryDetails.addressLine2,
      `${input.deliveryDetails.city} ${input.deliveryDetails.postalCode}`
    ]
      .filter(Boolean)
      .join("\n");

    const emailResult = await sendOrderConfirmationEmail({
      to: input.email,
      customerName: customer.fullName,
      orderId,
      items: activeItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        priceAtTime: item.priceAtTime
      })),
      totalAmount,
      deliveryAddress
    });

    return {
      order: order.toObject(),
      emailResult
    };
  },
  getOrderById(id: string) {
    return orderRepository.findById(id);
  },
  async listOrders(params: {
    page: number;
    limit: number;
    status: string;
    customerId?: string;
    search: string;
  }) {
    const { data, total } = await orderRepository.list(params);

    return buildPaginationResult(data, total, params.page, params.limit);
  }
};
