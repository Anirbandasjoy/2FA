import mongoose from "mongoose";
import { dbURL } from ".";

if (!dbURL) {
  throw new Error(
    "Database URL (dbURL) is not defined in the environment variables."
  );
}
// db connection
const dbConnection = async () => {
  try {
    await mongoose.connect(dbURL as string);
    console.log("Database is connected successfully");

    mongoose.connection.on("error", (error: any) => {
      console.error("Database connection error", error.message);
    });
  } catch (error: any) {
    console.error("Initial database connection error", error.message);
  }
};

export default dbConnection;
