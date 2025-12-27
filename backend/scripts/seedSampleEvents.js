import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../src/config/db.js";
import Event from "../src/models/event.model.js";

dotenv.config();

const sampleEvents = [
  {
    name: "AI Horizons Summit",
    organizer: "School of Computing",
    category: "Technology",
    venue: "Main Auditorium",
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    time: "10:00 AM",
    fee: "Free",
    description:
      "A deep dive into generative AI use cases, featuring hands-on labs and expert panels.",
    sourceLink: "https://vitc-events.example.com/ai-horizons",
    sourceType: "manual",
    status: "approved",
  },
  {
    name: "Chennai Tech Fest",
    organizer: "IEEE Student Chapter",
    category: "Hackathon",
    venue: "Smart Classroom Complex",
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    time: "9:00 AM",
    fee: "₹499",
    description:
      "48-hour hackathon bringing together innovators to solve sustainability challenges.",
    sourceLink: "https://vitc-events.example.com/tech-fest",
    sourceType: "manual",
    status: "approved",
  },
  {
    name: "Design Thinking Sprint",
    organizer: "Innovation & Entrepreneurship Cell",
    category: "Workshops",
    venue: "Innovation Studio",
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    time: "2:00 PM",
    fee: "Free",
    description:
      "Fast-paced sprint to learn human-centered design for impactful product ideas.",
    sourceLink: "https://vitc-events.example.com/design-sprint",
    sourceType: "manual",
    status: "approved",
  },
  {
    name: "Sports Carnival Night",
    organizer: "Department of Physical Education",
    category: "Sports",
    venue: "VIT Sports Complex",
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    time: "5:00 PM",
    fee: "Free",
    description:
      "Inter-house sports gala featuring cricket, basketball, kho kho, and more.",
    sourceLink: "https://vitc-events.example.com/sports-night",
    sourceType: "manual",
    status: "approved",
  },
  {
    name: "Quantum Computing Bootcamp",
    organizer: "School of Advanced Sciences",
    category: "Research",
    venue: "Research Park Hall B",
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    time: "11:00 AM",
    fee: "₹999",
    description:
      "Mentored sessions on Qiskit, quantum algorithms, and real hardware experiments.",
    sourceLink: "https://vitc-events.example.com/quantum-bootcamp",
    sourceType: "manual",
    status: "approved",
  },
];

const seedSampleEvents = async () => {
  try {
    await connectDB();

    const insertable = sampleEvents.map((event) => ({
      ...event,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await Event.insertMany(insertable, { ordered: false });

    console.log(`Inserted ${insertable.length} sample events.`);
    process.exit(0);
  } catch (error) {
    if (error?.writeErrors) {
      console.warn("Some sample events already exist. Skipping duplicates.");
      process.exit(0);
    }

    console.error("Failed to seed sample events:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedSampleEvents();
