import React, { Fragment, useRef, useState } from "react";
import type { Message } from "~/types";
import type { Document } from "langchain/document";
import { ArticleSection } from "./ArticleSection";
import { Spinner } from "./Spinner";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export function InitialArticleRequest() {
  const input = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [articlePrinting, setArticlePrinting] = useState<boolean>(false);
  const [articleComplete, setArticleComplete] = useState<boolean>(false);
  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: Document[];
  }>({
    messages: [],
    history: [],
    pendingSourceDocs: [],
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const question = input.current?.value.trim() || "";
    e.currentTarget.reset();

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          message: question,
          type: "userMessage",
        },
      ],
      pending: undefined,
    }));

    setLoading(true);

    const control = new AbortController();

    try {
      await fetchEventSource("/api/initArticle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
        }),
        signal: control.signal,
        openWhenHidden: true,
        onmessage: (e) => {
          console.log("event", e);
          setLoading(false);
          if (e.data === "[DONE]") {
            setMessageState((state) => ({
              history: [...state.history, [question, state.pending ?? ""]],
              messages: [
                ...state.messages,
                {
                  message: state.pending ?? "",
                  sourceDocs: state.pendingSourceDocs,
                  type: "apiMessage",
                },
              ],
              pending: undefined,
              pendingSourceDocs: undefined,
            }));
            setArticlePrinting(false);
            setArticleComplete(true);
          } else {
            const data: { data?: string; sourceDocs?: Document[] } = JSON.parse(
              e.data
            ) as { data?: string; sourceDocs?: Document[] };
            setArticlePrinting(true);
            if (data.sourceDocs) {
              setMessageState((state) => ({
                ...state,
                pendingSourceDocs: data.sourceDocs,
              }));
            } else {
              setMessageState((state) => ({
                ...state,
                pending: (state.pending ?? "") + (data.data ?? ""),
              }));
            }
          }
        },
        onerror: () => {
          setLoading(false);
          control.abort();
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
        throw new Error(error.message);
      }
    }
  };

  if (loading) {
    return (
      <Fragment>
        <div className="flex items-center justify-center align-middle">
          <Spinner />
        </div>
      </Fragment>
    );
  }

  if (articlePrinting || articleComplete) {
    return (
      <Fragment>
        <div className="flex items-center justify-center align-middle">
          <ArticleSection
            messageState={messageState}
            articlePrinting={articlePrinting}
            articleComplete={articleComplete}
          />
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <div className="flex items-center justify-center align-middle">
        <div className="flex min-h-screen flex-col">
          <label
            htmlFor="name"
            className="ml-px block text-center text-sm font-medium leading-6 text-gray-900"
          >
            So what happened...
          </label>
          <form
            onSubmit={async (e) => {
              await handleSubmit(e);
            }}
            className="flex flex-col items-center"
          >
            <div className="my-2">
              <input
                type="text"
                name="name"
                id="name"
                className="block w-48 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="pausing GPT research"
                ref={input}
              />
            </div>
            <button
              type="submit"
              className="block rounded-full bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}
