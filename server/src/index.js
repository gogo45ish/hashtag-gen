import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  throw new Error("Missing OpenRouter API Key in environment variables.");
}

app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required and must be a string." });
    }

    // Prompt engineering for hashtag generation
    const prompt = `Extract high-quality hashtags for the following text:\n\n"${text}"\n\nOutput the hashtags only, comma-separated.`;

    // OpenRouter API call
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek-ai/DeepSeek-V3", // Replace with your desired model
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 20,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract generated text from OpenRouter response
    const generatedText = response.data.choices[0].message.content || "";

    // Convert response to an array of hashtags
    const hashtags = generatedText
      .split(",")
      .map((tag) => tag.trim().replace(/\s+/g, "").replace(/[^a-zA-Z0-9#]/g, ""))
      .filter((tag) => tag.startsWith("#"));

    return res.json({ hashtags });
  } catch (error) {
    console.error("Error generating hashtags:", error);
    return res.status(500).json({ error: "Failed to generate hashtags" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;