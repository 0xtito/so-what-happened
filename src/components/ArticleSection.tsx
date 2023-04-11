import React, { useEffect, useRef, useState, useMemo } from "react";
import { Document } from "langchain/document";
import { Disclosure, Transition } from "@headlessui/react";

import { Message, ArticleSectionProps, ArticleDocument } from "~/types";
import { SourcesDropDown } from "./SourcesDropDown";

export function ArticleSection(props: ArticleSectionProps) {
  const { messages, pending, history, pendingSourceDocs } = props.messageState;
  const { articlePrinting, articleComplete } = props;
  const [articleData, setArticleData] = useState<Message>({} as Message);
  const [articleText, setArticleText] = useState("");

  function removeDocumentDuplicates(arr: Document[]) {
    if (!arr) {
      return [];
    }
    const seen = new Set();
    return arr.filter((item) => {
      const json = JSON.stringify(item);
      if (seen.has(json) || seen.has(item.metadata.title)) {
        return false;
      } else {
        seen.add(json);
        seen.add(item.metadata.title);
        return true;
      }
    });
  }

  const uniqueSources = useMemo(() => {
    return removeDocumentDuplicates(
      articleData.sourceDocs! || messages[messages.length - 1]?.sourceDocs
    );
  }, [articleData]);

  const articleTitle = useMemo(() => {
    return (pending || articleText)!
      .trim()
      .split("\n\n")[0]
      ?.split("# Article:")[1] as string;
  }, [articleText, pending]);

  useEffect(() => {
    if (!messages[messages.length - 1]) {
      return;
    }
    setArticleText(messages[messages.length - 1]?.message as string);
    setArticleData(messages[messages.length - 1] as Message);

    if (articleComplete) {
      console.log("article complete");
    }
  }, [articleComplete]);

  if (articlePrinting || articleComplete) {
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-lg">{articleTitle}</h2>
        <div>
          {(pending || articleText)!
            .trim()
            .split("\n\n")
            .map((paragraph, index) => (
              <p key={index} className="my-4 flex flex-col ">
                {paragraph.search("# Article:") === -1 && paragraph}
              </p>
            ))}
        </div>
        {articleComplete && <SourcesDropDown sources={uniqueSources} />}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <p>You should not have gotten here</p>
    </div>
  );
}
