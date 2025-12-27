import asyncHandler from "express-async-handler";

export const verifyScraperToken = asyncHandler((req, res, next) => {
  const token = req.headers["x-scraper-token"] || req.query.token;

  if (!process.env.SCRAPER_TOKEN) {
    res.status(500);
    throw new Error("SCRAPER_TOKEN not configured on server");
  }

  if (!token || token !== process.env.SCRAPER_TOKEN) {
    res.status(401);
    throw new Error("Invalid scraper token");
  }

  next();
});
