import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Reuse one connection across warm serverless invocations instead of
// reconnecting on every request.
let connectionPromise = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI, {
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 10000,
      })
      .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn.connection;
      })
      .catch((error) => {
        connectionPromise = null;
        console.error(`MongoDB connection error: ${error.message}`);
        throw error;
      });
  }

  return connectionPromise;
};

export function getDB() {
  if (!mongoose.connection.readyState) {
    throw new Error("Database not initialized. Call connectDB() first.");
  }
  return mongoose.connection.db;
}
