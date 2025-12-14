import mongoose from 'mongoose';

/**
 * Connect to MongoDB using mongoose.
 * @param {string} [uri] optional MongoDB URI; falls back to process.env.MONGO_URI
 * @returns {Promise<boolean>} true if connected, false otherwise
 */
const connectDB = async (uri = process.env.MONGODB_URL) => {
  mongoose.set('strictQuery', false);

  if (!uri) {
    console.error('connectDB: MONGO_URI is not set');
    return false;
  }

  try {
 
  await mongoose.connect(uri);
    console.log('MongoDB connected');
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    return false;
  }
};

export default connectDB;
