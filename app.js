import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import route from "./Routes/auth.js";
import integration from "./Routes/integration.js";
import fetcher from "./Controllers/GithubFetcher.js";
import data from "./Routes/DataRoutes.js";
import search from "./Routes/search.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API IS Running");
});
app.use("/auth", route);
const MONGO_URI = process.env.MONGO_URI;
app.use('/integration', integration)
app.use('/github',fetcher)
app.use('/data',data)
app.use('/collective',search)
async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database connected Successfully");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

start();

