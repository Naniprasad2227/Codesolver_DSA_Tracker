const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Use reliable Google DNS servers if local/cloud DNS fails SRV lookups
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Ignore if DNS server configuration cannot be overridden
}

const connectDB = async () => {
  try {
    let mongoUri = (process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codesolver').trim();

    // Strip accidental surrounding quotes if copied from env files
    if (
      (mongoUri.startsWith('"') && mongoUri.endsWith('"')) ||
      (mongoUri.startsWith("'") && mongoUri.endsWith("'"))
    ) {
      mongoUri = mongoUri.slice(1, -1).trim();
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
