import { OpenAI } from "langchain";
import { initializeAgentExecutor } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import { PromptTemplate } from "langchain";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { ApifyClient } from "apify-client";
import type { GoogleParameters } from "serpapi";
import { getJson } from "serpapi";

import { GoogleNewsResults } from "~/types";

const serpAPIKey = process.env.SERPAPI_API_KEY;

export async function getUrls(searchTerm: string) {
  const params = {
    q: searchTerm,
    tbm: "nws",
    api_key: serpAPIKey,
    location: "United States",
    num: "12",
  } satisfies GoogleParameters;

  const result = await getJson("google", params);
  // console.log(result["news_results"]);
  // setting to any for now
  const allResults = result["news_results"] as GoogleNewsResults[];
  const urls: string[] = allResults.map((result) => {
    return result["link"] !== null ? result["link"] : "";
  });
  // console.log(`urls: ${urls}`);
  return urls;
}
