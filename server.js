require("dotenv").config()
const express = require("express")
const cors = require("cors")
const axios = require("axios")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3000

// Enhanced CORS configuration for mobile apps
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true)

    // Allow any origin in development
    if (process.env.NODE_ENV !== "production") {
      return callback(null, true)
    }

    // In production, you can be more restrictive
    // For now, allow all origins (you can customize this later)
    callback(null, true)
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}

app.use(cors(corsOptions))
app.use(express.json({ limit: "10mb" }))
app.use(express.static(path.join(__dirname, "public")))

// Add a health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.post("/analyze-image", async (req, res) => {
  console.log(`[${new Date().toISOString()}] Received image analysis request`)

  const { image } = req.body

  if (!image || typeof image !== "string" || !image.startsWith("data:image/")) {
    console.log("Invalid image data provided")
    return res
      .status(400)
      .json({ error: "A valid image data URL was not provided." })
  }

  if (!process.env.OPENROUTER_API_KEY) {
    console.log("Missing OpenRouter API key")
    return res
      .status(500)
      .json({ error: "API key is not configured on the server." })
  }

  try {
    console.log("Calling OpenRouter API...")

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.2-11b-vision-instruct",
        max_tokens: 50,
        temperature: 0.1,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: 'Look at this image carefully. Is there a hamburger (burger/cheeseburger/meat patty in a bun) visible in this image? Answer with exactly "HAMBURGER" if you see a hamburger, or exactly "NOT_HAMBURGER" if you do not see a hamburger. Be very strict - only respond HAMBURGER if you clearly see a meat patty in a bun.',
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
          "HTTP-Referer":
            req.get("Origin") || "https://not-hamburger-r9z0.onrender.com",
          "X-Title": "Not Hamburger",
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
              aiResponse.includes("HAMBURGER") &&
              !aiResponse.includes("NOT_HAMBURGER")
                ? "HAMBURGER"
                : "NOT_HAMBURGER",
          },
        },
      ],
    }

    console.log("Sending successful response")
    res.json(result)
  } catch (error) {
    console.error("Error calling OpenRouter API:", error.message)

    let errorMessage = "Failed to analyze image."
    let statusCode = 500

    if (error.code === "ECONNABORTED") {
      errorMessage = "The request to the AI timed out. Please try again."
      statusCode = 504
    } else if (error.response?.data?.error) {
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

    console.log(`Sending error response: ${statusCode} - ${errorMessage}`)
    res.status(statusCode).json({ error: errorMessage })
  }
})

// Keep the server warm (helps with Render cold starts)
if (process.env.NODE_ENV === "production") {
  setInterval(async () => {
    try {
      await axios.get(
        `${
          process.env.RENDER_EXTERNAL_URL || "http://localhost:" + PORT
        }/health`
      )
      console.log("Keep-alive ping sent")
    } catch (err) {
      console.log("Keep-alive ping failed:", err.message)
    }
  }, 14 * 60 * 1000) // Every 14 minutes
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
})
