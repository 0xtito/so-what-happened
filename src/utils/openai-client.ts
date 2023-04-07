import { OpenAI } from "langchain";

/**
 * project desgin inspired from @mayooear
 */

export const openai = new OpenAI({
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});
