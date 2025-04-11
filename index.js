const express = require("express");
const axios = require("axios");
const fs = require("fs");
const app = express();

app.use(express.json());

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
const COUNT_FILE = "executions.json";

// Load or initialize execution count
let totalExecutions = 0;
if (fs.existsSync(COUNT_FILE)) {
  const file = fs.readFileSync(COUNT_FILE);
  const json = JSON.parse(file);
  totalExecutions = json.total || 0;
}

// Endpoint for Roblox
app.post("/", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).send("Missing username");
  }

  totalExecutions += 1;

  // Save updated count
  fs.writeFileSync(COUNT_FILE, JSON.stringify({ total: totalExecutions }));

  const formatted = totalExecutions.toLocaleString();
  const message = `User: ${username} has executed the script! Global total: ${formatted}. Enjoy!`;

  try {
    await axios.post(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`, {
      content: message
    }, {
      headers: {
        Authorization: `Bot ${TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    res.send("Execution logged & message sent.");
  } catch (err) {
    console.error("Discord error:", err.response?.data || err.message);
    res.status(500).send("Failed to send message.");
  }
});

app.get("/", (req, res) => {
  res.send(`API is running. Global executions: ${totalExecutions}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
