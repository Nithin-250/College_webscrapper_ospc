import { Router } from "express";
import { fetchVitEventHub, pushScrapedEvents } from "../controllers/scraper.controller.js";
import { verifyScraperToken } from "../middlewares/scraperAuth.js";

const router = Router();

router.post("/push", verifyScraperToken, pushScrapedEvents);
router.get("/vit", verifyScraperToken, fetchVitEventHub);

export default router;
