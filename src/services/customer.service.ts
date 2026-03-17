import { hashPassword, verifyPassword } from "@/lib/auth";
import { customerRepository } from "@/repositories/customer.repository";
import { generatePrefixedSequenceId } from "@/lib/sequence";
import { seqIdConstants } from "@/constants/seqIdConstants";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function buildPaginationResult<T>(data: T[], total: number, page: number, limit: number) {
  return {
    data,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1
  };
}

export const customerService = {
  async createCustomer(payload: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  }) {
    const normalizedEmail = normalizeEmail(payload.email);
    const existingCustomer = await customerRepository.findByEmail(normalizedEmail);

    if (existingCustomer) {
      return existingCustomer;
    }

    const customerId = await generatePrefixedSequenceId(seqIdConstants.USER);

    return customerRepository.create({
      ...payload,
      email: normalizedEmail,
      customerId
    });
  },
  async signupCustomer(payload: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    password: string;
  }) {
    const normalizedEmail = normalizeEmail(payload.email);
    const existingCustomer = await customerRepository.findByEmail(normalizedEmail);

    if (existingCustomer) {
      if (!existingCustomer.passwordHash) {
        const upgradedCustomer = await customerRepository.updateById(existingCustomer._id.toString(), {
          fullName: payload.fullName,
          email: normalizedEmail,
          phone: payload.phone,
          address: payload.address,
          passwordHash: hashPassword(payload.password)
        });

        if (!upgradedCustomer) {
          throw new Error("Failed to activate existing customer account.");
        }

        return upgradedCustomer;
      }

      throw new Error("Customer already exists. Please sign in instead.");
    }

    const customerId = await generatePrefixedSequenceId(seqIdConstants.USER);

    return customerRepository.create({
      fullName: payload.fullName,
      email: normalizedEmail,
      phone: payload.phone,
      address: payload.address,
      passwordHash: hashPassword(payload.password),
      customerId
    });
  },
  async loginCustomer(payload: { email: string; password: string }) {
    const normalizedEmail = normalizeEmail(payload.email);
    const customer = await customerRepository.findByEmailHydrated(normalizedEmail);

    if (!customer) {
      throw new Error("Invalid email or password.");
    }

    if (!customer.passwordHash) {
      throw new Error("This account does not have a password yet. Please sign up again with the same email to activate login.");
    }

    const isValid = verifyPassword(payload.password, customer.passwordHash);

    if (!isValid) {
      throw new Error("Invalid email or password.");
    }

    return customer.toObject();
  },
  getCustomerById(id: string) {
    return customerRepository.findById(id);
  },
  async listCustomers(search: string, page: number, limit: number) {
    const { data, total } = await customerRepository.list(search, page, limit);
    return buildPaginationResult(data, total, page, limit);
  }
};
