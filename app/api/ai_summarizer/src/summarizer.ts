import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function summarizeReview(text: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are an assistant that summarizes customer reviews into 1-2 sentence highlights.',
      },
      {
        role: 'user',
        content: `Summarize the following review:\n${text}`,
      },
    ],
  });

  return completion.choices[0].message.content || 'No summary available.';
}
