import { Query, Schema } from "mongoose";

export type SoftDeleteFields = {
  isDeleted?: boolean;
  deletedAt?: Date | null;
  deletedBy?: string | null;
};

export const activeRecordFilter = {
  isDeleted: { $ne: true }
};

export function applySoftDeleteQueryMiddleware(schema: Schema) {
  schema.pre(/^find/, function softDeleteQuery(next) {
    (this as Query<unknown, unknown>).where(activeRecordFilter);
    next();
  });

  schema.pre("countDocuments", function softDeleteCount(next) {
    (this as Query<unknown, unknown>).where(activeRecordFilter);
    next();
  });
}
