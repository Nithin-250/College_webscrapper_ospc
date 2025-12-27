import { Router } from "express";
import { loginAdmin } from "../controllers/adminAuth.controller.js";
import {
  getAdminEvents,
  getAdminEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  approveEvent,
  rejectEvent,
} from "../controllers/event.controller.js";
import { protectAdmin, requireRole } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", loginAdmin);

router.get("/events", protectAdmin, getAdminEvents);
router.get("/events/:id", protectAdmin, getAdminEventById);
router.post("/events", protectAdmin, createEvent);
router.put("/events/:id", protectAdmin, updateEvent);
router.delete("/events/:id", protectAdmin, requireRole("superadmin"), deleteEvent);
router.put("/events/:id/approve", protectAdmin, approveEvent);
router.put("/events/:id/reject", protectAdmin, rejectEvent);

export default router;
