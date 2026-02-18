const mongoose = require("mongoose");
const dbConnect = require("./config/database/dbConnect");
const UserModel = require("./model/user/userModel");

const generateAgwid = async () => {
    try {
        let isUnique = false;
        let agwid = "";
        let attempts = 0;

        while (!isUnique && attempts < 20) {
            attempts++;
            // Determine number of digits: start with 6, switch to 7 if we have too many collisions
            const digits = attempts > 10 ? 7 : 6;

            // Generate random number
            const max = Math.pow(10, digits);
            const randomNumber = Math.floor(Math.random() * max);
            const paddedNumber = randomNumber.toString().padStart(digits, "0");

            agwid = `AGPW${paddedNumber}`;

            const existingUser = await UserModel.findOne({ agwid });
            if (!existingUser) {
                isUnique = true;
            }
        }

        if (!isUnique) {
            throw new Error("Failed to generate unique AGW ID after multiple attempts");
        }

        return agwid;
    } catch (error) {
        console.error("Error generating AGW ID:", error);
        throw error;
    }
};

const runMigration = async () => {
    console.log("Starting ID regeneration...");

    // Initialize DB Connection
    dbConnect();

    // Wait for connection
    console.log("Waiting for database connection...");
    let connected = false;
    for (let i = 0; i < 30; i++) { // Wait up to 30 seconds
        if (mongoose.connection.readyState === 1) {
            connected = true;
            break;
        }
        await new Promise(r => setTimeout(r, 1000));
    }

    if (!connected) {
        console.error("Could not connect to database.");
        process.exit(1);
    }

    console.log("Connected. Fetching users...");

    try {
        const users = await UserModel.find({});
        console.log(`Found ${users.length} users.`);

        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const oldId = user.agwid;

            try {
                const newId = await generateAgwid();

                await UserModel.updateOne(
                    { _id: user._id },
                    { $set: { agwid: newId } }
                );

                console.log(`[${i + 1}/${users.length}] Updated User ${user._id} (${user.userName}): ${oldId || 'None'} -> ${newId}`);
            } catch (innerErr) {
                console.error(`Failed to update user ${user._id}:`, innerErr.message);
            }
        }

        console.log("All users updated successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Error during migration:", err);
        process.exit(1);
    }
};

runMigration();
