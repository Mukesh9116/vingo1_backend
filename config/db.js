
import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("DB connected successfully");
  } catch (error) {
    console.error("DB connection error:", error.message);
    process.exit(1); // server band kar dega agar DB fail ho
  }
};

export default connectDb;
