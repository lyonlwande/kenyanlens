import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
  tokenId: { type: String, required: true, unique: true }, // UUID or JTI
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expires: { type: Date, required: true },
  revoked: { type: Boolean, default: false },
  replacedBy: { type: String }, // tokenId of new token if rotated
  createdAt: { type: Date, default: Date.now },
  userAgent: { type: String },
  ip: { type: String }
});

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
export default RefreshToken;
