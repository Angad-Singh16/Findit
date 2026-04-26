import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema(
  {
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    proof_description: {
      type: String,
      required: [true, 'Please describe proof of ownership'],
    },
    proof_images: [{ type: String }],

    reviewed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewed_at: { type: Date },

    rejection_reason: { type: String },
  },
  { timestamps: true }
);

"cmt">// One user can have only one active claim per item
claimSchema.index(
  { item_id: 1, user_id: 1 },
  { unique: true }
);

const Claim = mongoose.model('Claim', claimSchema);

export default Claim;