const mongoose = require("mongoose");
const dotenv = require("dotenv");
const UserModel = require("./model/user/userModel");
const fs = require('fs');

// Load env vars
dotenv.config();

// Connect to DB
const connectDB = async () => {
    try {
        const mongoURI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.69vdrs0.mongodb.net/${process.env.MONGO_DATABASE_NAME}`;
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB...");
    } catch (err) {
        console.error("DB Connection Failed:", err);
        process.exit(1);
    }
};

const getCredentials = async () => {
    await connectDB();

    try {
        const males = await UserModel.find({ gender: "Male", profileCreatedFor: "Self" }).limit(5).select("userEmail gender");
        const females = await UserModel.find({ gender: "Female", profileCreatedFor: "Self" }).limit(5).select("userEmail gender");

        let output = "=== TEST CREDENTIALS ===\nPassword for all: password123\n\n";

        output += "--- Male Accounts ---\n";
        males.forEach(u => output += `Email: ${u.userEmail}\n`);

        output += "\n--- Female Accounts ---\n";
        females.forEach(u => output += `Email: ${u.userEmail}\n`);

        fs.writeFileSync('credentials.txt', output);
        console.log("Credentials written to credentials.txt");

    } catch (error) {
        console.error("Error fetching users:", error);
    } finally {
        mongoose.connection.close();
    }
};

getCredentials();
