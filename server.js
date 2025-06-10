require("dotenv").config()
const express = require("express")
const cors = require("cors")
const axios = require("axios")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json({ limit: "10mb" }))
app.use(express.static(path.join(__dirname, 'public')))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.post("/analyze-image", async (req, res) => {
  const { image } = req.body

  if (!image) {
    return res.status(400).json({ error: "Image data is required." })
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return res
      .status(500)
      .json({ error: "API key is not configured on the server." })
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.2-11b-vision-instruct:free",
        max_tokens: 50, // Increased from 15
        temperature: 0.1, // Lower temperature for more consistent responses
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: 'Look at this image carefully. Is there a hotdog (hot dog/frankfurter/sausage in a bun) visible in this image? Answer with exactly "HOTDOG" if you see a hotdog, or exactly "NOT_HOTDOG" if you do not see a hotdog. Be very strict - only respond HOTDOG if you clearly see a sausage in a bun.',
              },
              { type: "image_url", image_url: { url: image } },
            ],
          },
        ],
      },
      {
        timeout: 30000,
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Not Hotdog",
        },
      }
    )

    const aiResponse = response.data.choices[0].message.content
      .trim()
      .toUpperCase()
    console.log("AI Response:", aiResponse)

    // Return standardized response
    const result = {
      ...response.data,
      choices: [
        {
          ...response.data.choices[0],
          message: {
            ...response.data.choices[0].message,
            content:
              aiResponse.includes("HOTDOG") &&
              !aiResponse.includes("NOT_HOTDOG")
                ? "HOTDOG"
                : "NOT_HOTDOG",
          },
        },
      ],
    }

    res.json(result)
  } catch (error) {
    console.error("Error calling OpenRouter API:", error)

    let errorMessage = "Failed to analyze image."
    let statusCode = 500

    if (error.code === "ECONNABORTED") {
      errorMessage = "The request to the AI timed out. Please try again."
      statusCode = 504
    } else if (
      error.response &&
      error.response.data &&
      error.response.data.error
    ) {
      const apiError = error.response.data.error
      if (apiError.code === 429) {
        errorMessage =
          "The free model is temporarily busy. Please try again in a moment."
        statusCode = 429
      } else if (apiError.message) {
        errorMessage = apiError.message
        statusCode = error.response.status
      }
    }

    res.status(statusCode).json({ error: errorMessage })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
