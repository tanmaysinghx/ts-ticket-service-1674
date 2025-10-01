import mongoose from 'mongoose';

export async function connectToDatabase(): Promise<void> {
  const mongoUri = process.env.DB_URI || "";

  try {
    await mongoose.connect(mongoUri);
    console.log('📦 Connected to MongoDB database');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}
