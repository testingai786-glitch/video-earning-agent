const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, apiKey } = req.body;
    if (!apiKey) return res.status(400).json({ error: 'API key daalo!' });
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: 'openrouter/auto',
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const text = await response.text();
    const data = JSON.parse(text);
    if (data.error) return res.status(400).json({ error: data.error.message });
    res.json({ text: data.choices[0].message.content });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT);
