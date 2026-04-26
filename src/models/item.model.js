import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "claimed", "resolved", "expired"],
      default: "open",
    },

    category: {
      name: { type: String, required: true },
      icon: { type: String },
    },

    location: {
      name: { type: String, required: true },
      building: { type: String },
      floor: { type: String },
      lat: { type: Number },
      lng: { type: Number },
    },

    image_urls: [{ type: String }],

    date_occurred: { type: Date },

    tags: [{ type: String }],
  },
  { timestamps: true }
);

itemSchema.index(
  { title: "text", description: "text", tags: "text" },
  { weights: { title: 3, tags: 2, description: 1 } }
);

const Item = mongoose.model("Item", itemSchema);

export default Item;
