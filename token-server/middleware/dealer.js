import { connectDB } from "../server.js";

export async function validateDealer(req, res, next) {
  const { dealerId } = req.params;
  const origin = req.headers.origin;

  if (!origin) return res.status(403).json({ error: "Missing origin" });

  let hostname;

  try {
    hostname = new URL(origin).hostname;
  } catch {
    return res.status(400).json({ error: "Invalid hostname" });
  }

  const dealer = await connectDB()
    .collection("users")
    .findOne({ _id: dealerId, active: true });

  if (!dealer || !dealer.allowedDomains.includes(hostname)) {
    return res.status(403).json({ error: "unauthorized" });
  }

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Vary", "Origin");

  req.dealer = dealer;
  next();
}
