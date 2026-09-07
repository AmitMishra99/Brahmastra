import mongoose  from "mongoose";

const connectDB = async () => {
  try {
    const connectDB = await mongoose.connect(process.env.MONGODB_URL);
  } catch (e) {
    console.log(`DB connection failed due to ${e}`);
  }
};

export default connectDB;
