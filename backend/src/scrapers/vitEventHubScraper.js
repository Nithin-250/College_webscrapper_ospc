import axios from "axios";
import * as cheerio from "cheerio";

const BASE_URL = "https://eventhubcc.vit.ac.in/EventHub/";

const createFallbackDates = (index) => {
  const now = new Date();
  const startOffsetDays = index % 7; // spread events across the next week
  const startDate = new Date(now.getTime() + startOffsetDays * 24 * 60 * 60 * 1000);
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
  const deadline = new Date(startDate.getTime() - 12 * 60 * 60 * 1000);

  return { startDate, endDate, deadline };
};

const normaliseText = (text) => text.replace(/\s+/g, " ").trim();

const extractEventCards = ($) => {
  const cards = [];

  $("a, .MuiPaper-root, .MuiCard-root").each((_, element) => {
    const node = $(element);
    const titleNode = node.find("h3, h4, h5, h6").first();
    const link = node.is("a") ? node.attr("href") : node.find("a").attr("href");

    const name = normaliseText(titleNode.text() || node.text());

    if (!name || name.length < 4) {
      return;
    }

    const description = normaliseText(node.find("p").text());

    cards.push({
      name,
      description: description || name,
      sourceLink: link ? new URL(link, BASE_URL).toString() : BASE_URL,
    });
  });

  return cards;
};

const dedupeEvents = (events) => {
  const map = new Map();

  events.forEach((event) => {
    const key = event.name.toLowerCase();

    if (!map.has(key)) {
      map.set(key, event);
    }
  });

  return Array.from(map.values());
};

export const scrapeVitEventHub = async () => {
  const { data } = await axios.get(BASE_URL);
  const $ = cheerio.load(data);

  const rawEvents = extractEventCards($);
  const deduped = dedupeEvents(rawEvents);

  return deduped.map((event, index) => {
    const { startDate, endDate, deadline } = createFallbackDates(index);

    return {
      name: event.name,
      description: event.description,
      organizer: "VIT Chennai",
      category: "General",
      venue: "VIT Chennai Campus",
      startDate,
      endDate,
      deadline,
      time: "TBA",
      fee: event.description?.toLowerCase().includes("fee") ? event.description : "Free",
      sourceLink: event.sourceLink,
      sourceType: "scraper",
      status: "pending",
    };
  });
};

export default scrapeVitEventHub;
