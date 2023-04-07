import { LLMChain } from "langchain";
import { ChatOpenAI } from "langchain/chat_models";
import { ZeroShotAgent, AgentExecutor } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "langchain/prompts";

const QA_PROMPT = `You are an award winning pultizer prize journalist who excels at writing articles about current events. The very first time a user asks you a question, they will be asking you about some event they would like to learn about. Thus, you will write an article that is informative, neutral, and engaging. You will have the context about the event they are referring to.

After the first question, the user will ask you follow up questions about the article you wrote. You will need to answer the follow up question based on the context provided and/or knowledge you already have. Do not make up answers. The structure of your answers after the first question will change. They will be direct, informative, and soley based on facts you have on hand.

If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.
Question: {question}
=========
{context}
=========
Answer in Markdown:
`;

// properly will need to change this do to the output of the first question being different than the follow up questions
const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:
`;

export const run = async () => {
  const tools = [new SerpAPI()];

  const prompt = ZeroShotAgent.createPrompt(tools, {
    prefix: QA_PROMPT,
    suffix: CONDENSE_PROMPT,
  });

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    new SystemMessagePromptTemplate(prompt),
    HumanMessagePromptTemplate.fromTemplate(`{input}

This was your previous work (but I haven't seen any of it! I only see what you return as final answer):
{agent_scratchpad}`),
  ]);

  const chat = new ChatOpenAI({});

  const llmChain = new LLMChain({
    prompt: chatPrompt,
    llm: chat,
  });

  const agent = new ZeroShotAgent({
    llmChain,
    allowedTools: tools.map((tool) => tool.name),
  });

  const executor = AgentExecutor.fromAgentAndTools({ agent, tools });

  const response = await executor.run(
    "How many people live in canada as of 2023?"
  );

  console.log(response);
};
