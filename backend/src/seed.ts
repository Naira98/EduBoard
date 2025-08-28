import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { MONGO_URI } from "./config/config";
import { User, UserRole } from "./models/user";

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database connection successful. Seeding started...");

    const salt = await bcrypt.genSalt();
    const managerPassword = await bcrypt.hash("managerpass", salt);
    const professorPassword = await bcrypt.hash("professorpass", salt);

    const manager = new User({
      username: "manager_user",
      email: "manager@test.com",
      password: managerPassword,
      role: UserRole.Manager,
    });

    // Create a new professor user
    const professor = new User({
      username: "professor_user",
      email: "professor@test.com",
      password: professorPassword,
      role: UserRole.Professor,
    });

    await manager.save();
    await professor.save();

    console.log(
      "Seeding complete! Manager and Professor users have been created."
    );
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seedDatabase();
