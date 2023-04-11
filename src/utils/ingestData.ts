import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeStore } from "langchain/vectorstores";
import { pinecone } from "~/utils/pinecone-client";
import { JSONLoader } from "langchain/document_loaders";
import { FormattedArticleData } from "~/types";
import { Document } from "langchain/document";

export async function ingestData(articleData: FormattedArticleData[]) {
  /**
   * 1. turn articleData to json
   * 2 use langchain doc loader
   * 3. use langchain text splitter
   * 4. embedded and send to pinecone
   */

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  // raw documents
  try {
    const textData = articleData.map((article) => {
      return article.text;
    });

    const articleMetaData = articleData.map((article) => {
      return {
        id: article.title || "",
        title: article.title || "",
        description: article.description || "",
        publisher: article.publisher || "",
        url: article.url || "",
        image: article.image || "",
      };
    });

    const docs = await textSplitter.createDocuments(textData, articleMetaData);

    // create vectorstore
    // const embeddings = new OpenAIEmbeddings();
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
    const namespace = process.env.PINECONE_NAMESPACE!;
    // await PineconeStore;

    // embed and send to pinecone
    await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
      pineconeIndex: index,
      namespace: namespace,
    });
  } catch (error) {
    console.log("error in ingestData", error);
    throw new Error("Failed to ingest data");
  }
}
