const axios = require('axios');

exports.analyzeComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: 'Title and description required'
      });
    }

    const prompt = `
You are an AI assistant for a Smart Complaint Management System.

Analyze the following complaint and respond ONLY in this exact JSON format:

{
  "priority": "High/Medium/Low",
  "department": "Department name",
  "summary": "One line summary",
  "autoResponse": "Auto response message to the user"
}

Complaint Details:
Title: ${title}
Category: ${category}
Description: ${description}

Rules:
- Priority: High if urgent/dangerous, Medium if moderate, Low if minor
- Department: Water Department / Electricity Department / Roads Department / Sanitation Department / Municipal Corporation / Other
- Summary: Max 20 words
- AutoResponse: Polite message to user in 2 sentences
`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const rawText =
      response.data.choices[0].message.content;

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return res.status(500).json({
        message: 'AI response parse error'
      });
    }

    const analysis = JSON.parse(jsonMatch[0]);

    res.status(200).json({
      success: true,
      analysis
    });

  } catch (err) {
    res.status(500).json({
      message: 'AI Error',
      error: err.response?.data || err.message
    });
  }
};