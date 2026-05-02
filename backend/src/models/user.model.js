import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/.+@.+\..+/, 'Invalid email'],
    },
    password: {
      type: String,
      required: true,
      select: false,        // ← never returned in queries by default
    },
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: ['student', 'staff', 'admin'],
      default: 'student',
    },
    campus_id: { type: String, trim: true },
    avatar_url: { type: String },
    is_verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ── Hash password before saving ───────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ── Compare password method ───────────────────────────────
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);