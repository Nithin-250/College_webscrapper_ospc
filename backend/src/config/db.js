import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    if (process.env.NODE_ENV !== "test") {
      // eslint-disable-next-line no-console
      console.warn("MONGO_URI not provided. Running in Google Sheets only mode.");
    }

    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGO_DB_NAME || "vit_event_hub",
    });

    if (process.env.NODE_ENV !== "test") {
      // eslint-disable-next-line no-console
      console.log("Connected to MongoDB");
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("MongoDB connection error:", error.message);
    // Don't exit process - continue with local Excel
    console.log("Continuing with local Excel sheet mode");
  }
};

export default connectDB;
