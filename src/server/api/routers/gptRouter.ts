// ~/server/api/trpc/chatGPT.router.ts
import {
  createTRPCRouter,
  privateProdcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeStore } from "langchain/vectorstores";
import { makeChain } from "~/utils/makechain";
import { pinecone } from "~/utils/pinecone-client";
import { initializeAgentExecutor } from "langchain/agents";
import { ChainTool, SerpAPI } from "langchain/tools";
// import { ZeroShotAgent } from "langchain/agents";

import { getChatGPTOutput } from "~/server/helpers/getGPTOutput";
import { getUrls } from "~/server/helpers/getUrls";
import { extractArticleTexts } from "~/server/helpers/extractArticleTexts";
import { ingestData } from "~/utils/ingestData";
import { ChainValues } from "langchain/schema";
import { openai } from "~/utils/openai-client";

// Import your LangChain function that handles the ChatGPT interaction
// import { getChatGPTOutput } from "~/server/langChain";

export const gptRouter = createTRPCRouter({
  chatGPT: publicProcedure
    .input(
      z.object({
        userInput: z.string(),
        history: z.array(z.tuple([z.string(), z.string()])),
      })
    )
    .query(async ({ input }) => {
      // const output = await getChatGPTOutput(input.userInput);
      // return output;
      const { userInput, history } = input;

      const sanitizedQuestion = userInput.trim().replaceAll("\n", " ");

      const urls = await getUrls(sanitizedQuestion);

      const articleTexts = await extractArticleTexts(urls);
      console.log(articleTexts);

      return articleTexts;

      // const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

      // const vectorStore = await PineconeStore.fromExistingIndex(
      //   new OpenAIEmbeddings({}),
      //   {
      //     pineconeIndex: index,
      //     textKey: "text",
      //     namespace: "default_test",
      //   }
      // );
    }),

  chatWithArticle: privateProdcedure
    .input(
      z.object({
        userInput: z.string(),
        history: z.array(z.tuple([z.string(), z.string()])),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

      const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings(),
        {
          pineconeIndex: index,
          textKey: "text",
          namespace: process.env.PINECONE_NAMESPACE!,
        }
      );

      const chain = makeChain(vectorStore, (token: string) => {
        return token;
      });

      const qaTool = new ChainTool({
        name: "article-qa",
        description:
          "Article QA - useful when the user asks a question about the article, and the information can be retrieved from the vectorstore",
        chain,
      });

      const tools = [new SerpAPI(), qaTool];

      const executer = await initializeAgentExecutor(
        tools,
        openai,
        "chat-conversational-react-description",
        true // setting to true for debugging reasons
      );

      console.log("Agent loaded");

      // await executer.memory?.saveContext(history[0], history[1]) could do something like to give the executer the memory of the article it gave the user

      const res = await executer.call({ input: input.userInput });
      console.log(res);

      return res;
    }),

  // things I am going to want to store in the database:
  // - user id
  // - question
  // - answer
  // - article texts
  // - article vectors

  // will be used for the first time the user asks a question
  // using a middlware, we are checking to make sure the user is signed in
  articleRequest: privateProdcedure
    .input(
      z.object({
        userInput: z.string(),
        history: z.array(z.tuple([z.string(), z.string()])),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId; // will use this once the ai responses, and we can then send to server
      // const { userInput, history } = input;
      const { userInput, history } = input;
      /**
       * So im pretty sure i need to get the history from the database, since i wont have it in the front-end
       * thus, i need to store the history, and new question/answer in the database
       */

      const sanitizedQuestion = userInput.trim().replaceAll("\n", " ");

      const urls = await getUrls(sanitizedQuestion);

      const articleData = await extractArticleTexts(urls);

      // formatting data, embedding, and ingesting into pinecone
      await ingestData(articleData);

      const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

      const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings(),
        {
          pineconeIndex: index,
          textKey: "text",
          namespace: process.env.PINECONE_NAMESPACE!,
        }
      );

      const chain = makeChain(vectorStore, (token: string) => {
        return token;
      });

      console.log(`chain`, chain);

      // so instead of using the chain here, it could be ideal to send the chain to the client - and from there call it. This will allow us to use the stream feature of pinecone

      try {
        const res: ChainValues = await chain.call({
          question: sanitizedQuestion,
          chat_history: history || [],
        });
        console.log(res);
        return JSON.stringify({
          response: res,
          sourceDocs: (res.sourceDocuments as Document[]) || [],
        });
      } catch (error) {
        console.log("Failed to get article data", error);
        throw new Error("Failed to get article data");
      }
    }),
});
