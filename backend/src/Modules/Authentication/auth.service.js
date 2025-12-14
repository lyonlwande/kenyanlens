
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from './jwt.js';
import User from '../User/user.model.js';
import RefreshToken from './refreshToken.model.js';

// Get user by id for /me endpoint
export async function getMe(userId) {
  const user = await User.findById(userId).select('-password');
  if (!user) return null;
  // Return only safe fields
  return {
    id: user._id,
    email: user.email,
    username: user.username,
    role: user.role,
    profilePic: user.profilePic,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

function getRefreshExpiry() {
  // Parse .env REFRESH_TOKEN_EXPIRES (e.g., '7d') to ms
  const val = process.env.REFRESH_TOKEN_EXPIRES || '7d';
  if (val.endsWith('d')) return parseInt(val) * 24 * 60 * 60 * 1000;
  if (val.endsWith('h')) return parseInt(val) * 60 * 60 * 1000;
  if (val.endsWith('m')) return parseInt(val) * 60 * 1000;
  return 7 * 24 * 60 * 60 * 1000;
}

export async function login(email, password, userAgent, ip) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');
  const accessToken = signAccessToken({ id: user._id, role: user.role });
  // Create refresh token
  const tokenId = uuidv4();
  const refreshToken = signRefreshToken({ id: user._id, tokenId });
  const expires = new Date(Date.now() + getRefreshExpiry());
  await RefreshToken.create({ tokenId, user: user._id, expires, userAgent, ip });
  return { accessToken, refreshToken, user: { id: user._id, email: user.email, role: user.role, username: user.username, profilePic: user.profilePic } };
}

export async function register(email, password, username, bio, userAgent, ip) {
  const exists = await User.findOne({ email });
  if (exists) throw new Error('Email already registered');
  const hash = await bcrypt.hash(password, 10);
  // Pass bio to user creation
  const user = await User.create({ email, password: hash, username, bio });
  const accessToken = signAccessToken({ id: user._id, role: user.role });
  const tokenId = uuidv4();
  const refreshToken = signRefreshToken({ id: user._id, tokenId });
  const expires = new Date(Date.now() + getRefreshExpiry());
  await RefreshToken.create({ tokenId, user: user._id, expires, userAgent, ip });
  return { accessToken, refreshToken, user: { id: user._id, email: user.email, role: user.role, username: user.username, profilePic: user.profilePic, bio: user.bio } };
}

export async function refresh(oldRefreshToken, userAgent, ip) {
  let payload;
  try {
    payload = verifyRefreshToken(oldRefreshToken);
  } catch (err) {
    throw new Error('Invalid refresh token');
  }
  const { id: userId, tokenId } = payload;
  const tokenDoc = await RefreshToken.findOne({ tokenId, user: userId });
  if (!tokenDoc || tokenDoc.revoked || tokenDoc.expires < new Date()) {
    throw new Error('Refresh token expired or revoked');
  }
  // Rotate: revoke old, create new
  tokenDoc.revoked = true;
  await tokenDoc.save();
  const newTokenId = uuidv4();
  const newRefreshToken = signRefreshToken({ id: userId, tokenId: newTokenId });
  const expires = new Date(Date.now() + getRefreshExpiry());
  await RefreshToken.create({ tokenId: newTokenId, user: userId, expires, userAgent, ip });
  tokenDoc.replacedBy = newTokenId;
  await tokenDoc.save();
  const accessToken = signAccessToken({ id: userId, role: tokenDoc.role });
  return { accessToken, refreshToken: newRefreshToken };
}

export async function logout(refreshToken) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    return; // Already invalid
  }
  const { id: userId, tokenId } = payload;
  await RefreshToken.updateOne({ tokenId, user: userId }, { revoked: true });
}
