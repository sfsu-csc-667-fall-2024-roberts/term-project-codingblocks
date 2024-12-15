import pgPromise from "pg-promise";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize pg-promise
const pgp = pgPromise();

// Create the database connection using the `DATABASE_URL` from environment variables
const connection = pgp(process.env.DATABASE_URL!);

// Export the database connection
export default connection;
