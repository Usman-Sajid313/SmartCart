import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { Request, Response, NextFunction } from 'express';

dotenv.config();
const app = express();
const port = 3000;

app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get('/', (_req: Request, res: Response) => {
  res.send('🎉 AI Review Summarizer API is running!');
});

// Define RequestHandler type for Express
type RequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

// Define the handler using the RequestHandler type
const handleSummarizeReviews: RequestHandler = async (req, res) => {
  const { reviews } = req.body;
  
  if (!Array.isArray(reviews) || reviews.length === 0) {
    res.status(400).json({ error: 'Please provide a list of reviews' });
    return;
  }
  
  const prompt = `Summarize these customer reviews in a concise paragraph:\n${reviews.join('\n')}`;
  
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
    });
    
    const summary = completion.choices[0].message?.content;
    res.json({ summary });
  } catch (err) {
    console.error('OpenAI API Error:', err);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
};

// Register the route with the handler
app.post('/summarize-reviews', handleSummarizeReviews);

app.listen(port, () => {
  console.log(`🚀 Review Summarizer running at http://localhost:${port}`);
});