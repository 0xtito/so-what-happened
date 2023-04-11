import type { NextApiRequest, NextApiResponse } from "next";
import { PineconeStore } from "langchain/vectorstores";
import { makeChain } from "~/utils/makechain";
import { api } from "~/utils/api";
import { initTRPC } from "@trpc/server";
import { createTRPCContext } from "~/server/api/trpc";
import { createTRPCProxyClient } from "@trpc/client";
import superjson from "superjson";
import { ZodError } from "zod";
import { getAuth } from "@clerk/nextjs/server";
import { appRouter } from "~/server/api/root";

// const trpcClient = createTRPCProxyClient<typeof appRouter>({
//   url: "/api/trpc",
//   transformer: superjson,
// });

/**
 * get/Create the chain from the chain, passing it the necessary info, then call the chain wit hthe sanitized question, store data in planetscale, and return the response
 * @info Inspired from @mayooear 's code
 * @param req
 * @param res
 * @returns
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { question } = req.body as { question: string };

  if (!question) {
    return res.status(400).json({ message: "No question in the request" });
  }

  const tRpc = createTRPCContext({ req, res });

  const caller = appRouter.createCaller(tRpc);

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  });

  const { vectorStore, sanitizedQuestion } = (await caller.gpt.articleRequest({
    userInput: question,
    history: [],
  })) as {
    sanitizedQuestion: string;
    vectorStore: PineconeStore;
  };

  console.log(`sanitizedQuestion`, sanitizedQuestion);
  console.log(`vectorStore`, vectorStore);

  await getResponse(vectorStore);

  async function getResponse(vectorStore: PineconeStore) {
    const sendData = (data: string) => {
      console.log(`sending data ${data}`);
      res.write(`data: ${data}\n\n`);
    };

    try {
      const chain = makeChain(vectorStore, (token: string) => {
        sendData(JSON.stringify({ data: token }));
      });

      const chainResponse = await chain.call({
        question: question,
        chat_history: [],
      });

      sendData(
        JSON.stringify({ sourceDocs: chainResponse.sourceDocuments as [] })
      );
    } catch (error) {
      console.log("error", error);
    } finally {
      sendData("[DONE]");
      res.end();
    }
  }
}
