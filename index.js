const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

app.post("/track", async (req, res) => {
  const { username, executions } = req.body;

  if (!username || !executions) {
    return res.status(400).send("Missing data");
  }

  const msg = `User: ${username} has executed the script (${executions.toLocaleString()}). Enjoy!`;

  try {
    await axios.post(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`, {
      content: msg
    }, {
      headers: {
        Authorization: `Bot ${TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    res.send("Message sent to Discord.");
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Failed to send message.");
  }
});

app.get("/", (req, res) => {
  res.send("API is running.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server started on port", PORT));
