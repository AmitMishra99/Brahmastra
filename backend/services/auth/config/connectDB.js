import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB connected !!`);
  } catch (e) {
    console.log(`DB connection failed due to ${e}`);
  }
};

export default connectDB;
