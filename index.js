import express from "express";
import cors from "cors";
import cardsRouter from "./routes/cards.js";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to parse JSON bodies from POST requests

// Base Route
app.get("/", (req, res) => {
  res.send("Welcome to the Card Collection API!");
});

// Mount card routes
app.use('/cards', cardsRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
