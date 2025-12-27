import dotenv from "dotenv";
import mongoose from "mongoose";
import readline from "readline";

import connectDB from "../src/config/db.js";
import Admin from "../src/models/admin.model.js";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) =>
  new Promise((resolve) => {
    rl.question(prompt, (answer) => resolve(answer.trim()));
  });

const seedAdmin = async () => {
  try {
    await connectDB();

    const usernameArg = process.argv[2];
    const passwordArg = process.argv[3];
    const roleArg = process.argv[4];

    const username =
      usernameArg || (await question("Enter admin username (email recommended): "));
    const password = passwordArg || (await question("Enter admin password: "));
    const roleInput = roleArg || (await question("Enter role (superadmin/editor) [superadmin]: "));

    const role = roleInput || "superadmin";

    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    const existingAdmin = await Admin.findOne({ username });

    if (existingAdmin) {
      console.log(`Admin with username ${username} already exists.`);
      process.exit(0);
    }

    const passwordHash = await Admin.hashPassword(password);

    await Admin.create({ username, passwordHash, role });

    console.log(`Admin user ${username} created with role ${role}.`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin:", error.message);
    process.exit(1);
  } finally {
    rl.close();
    await mongoose.connection.close();
  }
};

seedAdmin();
