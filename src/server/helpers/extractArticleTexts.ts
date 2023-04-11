import { ApifyClient } from "apify-client";

import { FormattedArticleData, RawArticleData } from "~/types";

// prob a hacky solution, but this makes it typesafe
function isRawArticleData(obj: unknown): obj is RawArticleData {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const record = obj as Record<string, unknown>;

  return (
    typeof record.title === "string" &&
    typeof record.description === "string" &&
    (typeof record.publisher === "string" ||
      typeof record.publisher === null) &&
    typeof record.url === "string" &&
    typeof record.text === "string"
  );
}

// Initialize the ApifyClient with API token
const client = new ApifyClient({
  token: process.env.APIFY_API_KEY,
});

export async function extractArticleTexts(urls: string[]) {
  const articleTexts: string[] = [];

  const startUrls = urls.map((url) => {
    return { url };
  });

  const input = {
    articleUrls: startUrls,
    crawlWholeSubdomain: false,
    enqueueFromArticles: false,
    isUrlArticleDefinition: {
      minDashes: 4,
      hasDate: true,
      linkIncludes: [
        "article",
        "storyid",
        "?p=",
        "id=",
        "/fpss/track",
        ".html",
        "/content/",
      ],
    },
    proxyConfiguration: {
      useApifyProxy: true,
    },
    mustHaveDate: true,
    onlyInsideArticles: true,
    onlyNewArticles: false,
    onlyNewArticlesPerDomain: false,
    onlySubdomainArticles: false,
    saveHtml: false,
    saveHtmlAsLink: false,
    saveSnapshots: false,
    scanSitemaps: false,
    scrollToBottom: false,
    useBrowser: false,
    useGoogleBotHeaders: false,
    minWords: 150,
  };

  const run = await client
    .actor("lukaskrivka/article-extractor-smart")
    .call(input);

  // Fetch and print actor results from the run's dataset (if any)
  console.log("Results from dataset");
  const { items } = await client.dataset(run.defaultDatasetId).listItems();

  const formattedData: FormattedArticleData[] = items.map((item) => {
    // because it is being returned as type "unkown" - just setting it to any
    const rawText = (item.text as string) || "";
    const title = (item.title as string) || "";
    const image = (item.image as string) || "";
    const description = (item.description as string) || "";
    const publisher = (item.publisher as string) || "";
    const url = (item.url as string) || "";

    const sanitizedText = rawText.trim().replaceAll("\n", " ");

    // can't extract types from items returned from apify
    // if (!isRawArticleData(item)) {
    //   throw new Error("item is not of type RawArticleData");
    // }
    // const { title, description, publisher, url }: FormattedArticleData = item;
    const formattedData = {
      title,
      image,
      description,
      publisher,
      url,
      text: sanitizedText,
    };
    return formattedData;
  });
  // console.log(formattedData);

  return formattedData;

  // items.forEach((item) => {
  //   console.dir(item);
  // });

  // return items;

  //   for (const url of urls) {
  //     const articleText = await extractArticleText(url);
  //     articleTexts.push(articleText);
  //   }

  // return articleTexts;
}
