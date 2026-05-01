const express = require('express');
const cors = require('cors');
const { SYSTEM_PROMPT, buildUserPrompt } = require('./prompt');
const outputFormat = require('./format.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/analyze', async (req, res) => {
  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: 'Transcript is required' });
  }

  try {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2:3b',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: buildUserPrompt(transcript),
          },
        ],
        stream: false,
        format: outputFormat,
      }),
    });

    const data = await response.json();
    res.json({ result: data.message.content });
  } catch (error) {
    console.error('Ollama error:', error);
    res.status(500).json({ error: 'Failed to analyze transcript' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});