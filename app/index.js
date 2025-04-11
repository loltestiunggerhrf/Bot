const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

app.post("/update", async (req, res) => {
  const { executions } = req.body;

  if (!executions) return res.status(400).send("Missing 'executions'");

  const formatted = (executions / 1000000).toFixed(2) + "m";
  const newName = `execution-${formatted}`;

  try {
    await axios.patch(`https://discord.com/api/v10/channels/${CHANNEL_ID}`, {
      name: newName
    }, {
      headers: {
        Authorization: `Bot ${DISCORD_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    res.send("Channel name updated!");
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send("Failed to update channel.");
  }
});

app.get("/", (req, res) => {
  res.send("Execution bot is running.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
