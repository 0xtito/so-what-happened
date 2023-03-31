import { Configuration, OpenAIApi } from "openai";
import {
  ChatCompletionRequestMessageRoleEnum,
  CreateChatCompletionResponse,
} from "openai";
import { AxiosResponse } from "axios";
import { ChatOpenAI } from "langchain/chat_models";
// import { HumanChatMessage, SystemChatMessage } from "langchain/dist/schema";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";

// directly through OpenAI
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);

const chat = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.2,
  modelName: "gpt-3.5-turbo",
});

// Promise<AxiosResponse<CreateChatCompletionResponse, any>>

export async function getChatGPTOutput(userInput: string): Promise<string> {
  // const prompt = `The user asked: ${userInput}\n\nThe AI answered:`;
  const prompt = `The user asked you: ${userInput}`;

  const messageReq = {
    content: prompt,
    role: ChatCompletionRequestMessageRoleEnum.User,
  };

  const res = await chat.call([
    new SystemChatMessage(
      "You are an award winning pultizer prize journalist. When a user asks you a question, create a response that is informative, neutral, and engaging."
    ),
    new HumanChatMessage(prompt),
  ]);

  return res.text;

  // const res = await openai.createChatCompletion({
  //   model: "gpt-3.5-turbo",
  //   messages: [messageReq],
  //   max_tokens: 400,
  //   temperature: 0.4,
  //   n: 1,
  //   stop: ["\n\n"],
  // });
  // res.data.choices[0]?.message?.content

  // return res.data.choices[0]?.message?.content
  //   ? res.data.choices[0].message.content
  //   : "error generating message";

  // Return the output from ChatGPT
  //   return chatGPTOutput.then((response) => response.data.choices[0].text);
}
