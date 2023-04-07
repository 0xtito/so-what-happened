import React, { Fragment, useEffect, useRef } from "react";
import {
  DetailedHTMLProps,
  ButtonHTMLAttributes,
  FormHTMLAttributes,
} from "react";
import { useUser } from "@clerk/nextjs";

import { api } from "~/utils/api";
import { ArticleSection } from "./ArticleSection";

export function InitialArticleRequest() {
  const input = useRef("");
  const user = useUser();
  const [articleData, setArticleData] = React.useState("");

  const ctx = api.useContext();

  const {
    mutate,
    isLoading: isLoadingArticle,
    data,
    isSuccess,
  } = api.gpt.articleRequest.useMutation({
    onSuccess: (data) => {
      // console.log(`on success data`, data);
      // setArticleData(data);
      console.log("success");
      input.current = "";
      void ctx.gpt.chatGPT.invalidate();
    },

    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      console.log(data);
      setArticleData(data);
    }
  }, [data, isSuccess]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.currentTarget.reset();
    console.log(input.current);

    mutate({ userInput: input.current, history: [] });
  };

  if (isSuccess) {
    return (
      <Fragment>
        <div className="flex items-center justify-center align-middle">
          <ArticleSection data={data} />
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
            onSubmit={(e) => {
              handleSubmit(e);
              input.current = "";
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
                // value={input.current}
                onChange={(e) => (input.current = e.target.value)}
                onSubmit={(e) => console.log("hi")}
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
