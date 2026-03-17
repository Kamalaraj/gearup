export const seqIdConstants = {
  USER: "user",
  CART: "cart",
  ORDER: "order",
  PRODUCT: "product"
} as const;

export type SequenceName = (typeof seqIdConstants)[keyof typeof seqIdConstants];

export const seqPrefixes: Record<SequenceName, string> = {
  [seqIdConstants.USER]: "USER",
  [seqIdConstants.CART]: "CART",
  [seqIdConstants.ORDER]: "ORDER",
  [seqIdConstants.PRODUCT]: "PROD"
};
