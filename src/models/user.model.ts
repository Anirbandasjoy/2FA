import { Document, model, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Number;
  isActive: boolean;
  verificationCode: string;
  verificationCodeExpiresAt: Date | null;
  twoFactorCode: string;
  twoFactorCodeExpiresAt: Date | null;
  twoFactorEnabled: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required field"],
    },
    email: {
      type: String,
      required: [true, "Email is required field"],
      unique: true,
    },
    password: { type: String, required: true },
    role: { type: Number, enum: [100005, 2000080], default: 100005 },
    isActive: { type: Boolean, default: false },
    verificationCode: { type: String, required: false },
    verificationCodeExpiresAt: { type: Date, required: false },
    twoFactorCode: { type: String, required: false },
    twoFactorCodeExpiresAt: { type: Date, required: false },
    twoFactorEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;
