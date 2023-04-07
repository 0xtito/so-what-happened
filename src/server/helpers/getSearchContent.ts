import { OpenAI } from "langchain";
import { initializeAgentExecutor } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import { PromptTemplate } from "langchain";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";

const serpAPIKey = process.env.SERPAPI_API_KEY;

export async function getSearchContent(searchTerm: string) {
  const model = new OpenAI({ temperature: 0.2 });
  // may not need to use tools, and will just to the serpAPI manually
  const tools = [
    new SerpAPI(serpAPIKey, {
      location: "United States",
      hl: "en",
      filter: "nws",
    }),
  ];

  const template = `You are an award winning pultizer prize journalist. When a user asks you a question, create a response that is informative, neutral, and engaging. You need to use at least 3, but ideally 5, sources, i.e. news articles, to answer the question. The user asked: {search}\n\nThe AI answered:`;

  const prompt = new PromptTemplate({
    inputVariables: ["search"],
    template: template,
  });

  const executer = await initializeAgentExecutor(
    tools,
    model,
    "zero-shot-react-description"
  );

  const input = `What is the`;
}
