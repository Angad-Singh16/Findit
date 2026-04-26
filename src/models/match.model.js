import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    lost_item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    found_item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      required: true,
    },
    match_reason: {
      type: [String],
    },
    status: {
      type: String,
      enum: ["suggested", "confirmed", "dismissed"],
      default: "suggested",
    },
    confirmed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);


  matchSchema.index({ lost_item_id: 1, found_item_id: 1 }, { unique: true });

const Match = mongoose.model("Match", matchSchema);

export default Match;
