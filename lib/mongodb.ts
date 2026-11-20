import "server-only";

import mongoose from "mongoose";

declare global {
  var mongooseConnectionPromise: Promise<typeof mongoose> | undefined;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!global.mongooseConnectionPromise) {
    global.mongooseConnectionPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
  }

  const pending = global.mongooseConnectionPromise;
  try {
    return await pending;
  } finally {
    if (global.mongooseConnectionPromise === pending) {
      global.mongooseConnectionPromise = undefined;
    }
  }
}
