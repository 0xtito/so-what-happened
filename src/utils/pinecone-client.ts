import { PineconeClient } from "@pinecone-database/pinecone";

async function initPinecone() {
  const pinecone = new PineconeClient();

  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIRONMENT!,
  });

  return pinecone;
}

export const pinecone = await initPinecone();
