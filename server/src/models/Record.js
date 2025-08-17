import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    title: { type: String, required: true },
    category: { type: String, enum: ["ID", "Finance", "Health", "Work", "Other"], default: "Other" },
    tags: [{ type: String }],
    notes: { type: String },
    // optional link to a file stored in GridFS
    fileIds: [{ type: mongoose.Schema.Types.ObjectId }]
  },
  { timestamps: true }
);

export default mongoose.model("Record", recordSchema);
