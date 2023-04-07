import React, { Fragment } from "react";

export function ArticleChatSection() {
  return (
    <Fragment>
      <div className="mb-0 flex flex-col justify-end align-bottom ">
        <label
          htmlFor="comment"
          className="text-sm font-medium leading-6 text-gray-900"
        >
          Ask about the article
        </label>
        <div className="mt-2">
          <textarea
            rows={4}
            name="comment"
            id="comment"
            className="w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
            defaultValue={""}
          />
        </div>
      </div>
    </Fragment>
  );
}
