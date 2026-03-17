import { model, models, Schema } from "mongoose";

type CounterDocument = {
  _id: string;
  seqValue: number;
};

const counterSchema = new Schema<CounterDocument>(
  {
    _id: {
      type: String,
      required: true
    },
    seqValue: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    versionKey: false,
    timestamps: true
  },
);

export const CounterModel = models.Counter || model<CounterDocument>("Counter", counterSchema);
