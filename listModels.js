/* global process */
import * as dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("No API key found in .env");
  process.exit(1);
}



async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();
    console.log("Available Models:");
    data.models.forEach(m => console.log(m.name));
  } catch (e) {
    console.error("Error listing models:", e);
  }
}

listModels();
