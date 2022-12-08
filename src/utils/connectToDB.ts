import mongoose from "mongoose";

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  throw new Error(`Please provide MONGO_URI as environment variable`);
}

const connectToDB = async () => {
  const connection = await mongoose.connect(mongoURI);
  console.log(`Mongodb Connected: `, connection.connection.host);
};

export default connectToDB;
