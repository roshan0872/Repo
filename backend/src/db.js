import mongoose from "mongoose";

// Vercel serverless functions are frozen between requests, so we cache the
// connection on globalThis to reuse it across invocations instead of
// opening a new one every time (which would exhaust the connection limit).
let cached = globalThis._mongoCache;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  if (!cached) cached = globalThis._mongoCache = { conn: null, promise: null };
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((m) => m.connection);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
