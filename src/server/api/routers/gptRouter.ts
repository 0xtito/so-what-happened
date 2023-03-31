// ~/server/api/trpc/chatGPT.router.ts
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

import { getChatGPTOutput } from "~/server/helpers/getGPTOutput";

// Import your LangChain function that handles the ChatGPT interaction
// import { getChatGPTOutput } from "~/server/langChain";

export const gptRouter = createTRPCRouter({
  chatGPT: publicProcedure
    .input(
      z.object({
        userInput: z.string(),
      })
    )
    .query(async ({ input }) => {
      const output = await getChatGPTOutput(input.userInput);
      return output;
    }),
});
