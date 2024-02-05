import mongoose from "mongoose";

// Establishes a connection to the MongoDB database
const connectToDatabase = async () => {
  try {
    // Connect to the database using the provided MONGO_URI
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
    });

    // Display a success message with the connected port
    console.log(`Connected to the MongoDB online database`);

    return conn;
  } catch (error) {
    // Display an error message if the connection fails
    console.error(`Error connecting to MongoDB: ${error.message}`);
    throw error; // Rethrow the error to handle it elsewhere if needed
  }
};

export default connectToDatabase;