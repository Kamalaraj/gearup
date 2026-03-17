import { seqPrefixes, type SequenceName } from "@/constants/seqIdConstants";
import { CounterModel } from "@/models/Counter";

export async function generateSequenceNum(sequenceName: SequenceName) {
  const counter = await CounterModel.findByIdAndUpdate(
    sequenceName,
    { $inc: { seqValue: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  return counter.seqValue;
}

export async function generatePrefixedSequenceId(sequenceName: SequenceName) {
  const nextValue = await generateSequenceNum(sequenceName);
  return `${seqPrefixes[sequenceName]}${nextValue.toString().padStart(4, "0")}`;
}
