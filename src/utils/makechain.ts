import { OpenAIChat } from "langchain/llms";
import { LLMChain, ChatVectorDBQAChain, loadQAChain } from "langchain/chains";
import { PineconeStore } from "langchain/vectorstores";
import { PromptTemplate } from "langchain";
// still need to get a better understanding of this
import { CallbackManager } from "langchain/callbacks";

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
const CONDENSE_PROMPT =
  PromptTemplate.fromTemplate(`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:
`);

const MAIN_PROMPT = PromptTemplate.fromTemplate(QA_PROMPT);

export function makeChain(
  vectorstore: PineconeStore,
  onTokenStream?: (token: string) => void
) {
  const questionGenerator = new LLMChain({
    llm: new OpenAIChat({
      temperature: 0,
      openAIApiKey: process.env.OPENAI_API_KEY,
    }),
    prompt: CONDENSE_PROMPT,
  });

  const docChain = loadQAChain(
    new OpenAIChat({
      temperature: 0,
      modelName: "gpt-3.5-turbo",
      streaming: Boolean(onTokenStream),
      callbackManager: onTokenStream
        ? CallbackManager.fromHandlers({
            handleLLMNewToken(token): Promise<void> {
              onTokenStream(token);
              console.log(token);
              return Promise.resolve(); // adding this to get rid of the error from not using await inside of an async function
            },
          })
        : undefined,
    }),
    { prompt: MAIN_PROMPT }
  );

  return new ChatVectorDBQAChain({
    vectorstore,
    combineDocumentsChain: docChain,
    questionGeneratorChain: questionGenerator,
    returnSourceDocuments: true,
    // k: 2, //number of source documents to return
  });
}
