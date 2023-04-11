import React, { Fragment } from "react";
import { Transition, Disclosure } from "@headlessui/react";
import {
  ChevronRightIcon,
  CheckCircleIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

import { ArticleDocument } from "~/types";

export function SourcesDropDown({ sources }: { sources: ArticleDocument[] }) {
  return (
    <div className="m-0 flex min-w-full flex-col divide-y divide-gray-200">
      {sources.map(({ metadata, pageContent }, index) => (
        <Disclosure key={metadata.title as string}>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex min-w-full items-center justify-between p-2 py-4">
                <span>{`Source ${index + 1}`}</span>
                {open ? (
                  <ChevronRightIcon
                    className="h-5 w-5 rotate-90 transform text-gray-400"
                    aria-hidden="true"
                  />
                ) : (
                  <ChevronRightIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                )}
              </Disclosure.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel className="text-gray-500">
                  <div className="rounded bg-white p-4 shadow-md">
                    <h2 className="mb-2 text-lg font-semibold">
                      {metadata.title}
                    </h2>
                    <p className="mb-4 text-gray-600">
                      <span className="font-medium">Publisher:</span>{" "}
                      {metadata.publisher}
                    </p>
                    <p className="mb-4 text-gray-600">
                      <span className="font-medium">Description:</span>{" "}
                      {metadata.description}
                    </p>
                    <a
                      href={metadata.url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Read the source article
                    </a>
                  </div>
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  );
}

{
  /* <Disclosure>
<Disclosure.Button className="py-2">
  {"Sources (" + uniqueSources.length + ")"}{" "}
</Disclosure.Button>
<Transition
  enter="transition duration-100 ease-out"
  enterFrom="transform scale-95 opacity-0"
  enterTo="transform scale-100 opacity-100"
  leave="transition duration-75 ease-out"
  leaveFrom="transform scale-100 opacity-100"
  leaveTo="transform scale-95 opacity-0"
>
  <Disclosure.Panel className="text-gray-500">
    Yes! You can purchase a license that you can share with your
    entire team.
  </Disclosure.Panel>
</Transition>
</Disclosure> */
}

{
  /* <div className="overflow-hidden bg-white shadow sm:rounded-md">
<ul role="list" className="divide-y divide-gray-200">
  {sources.map(({ metadata, pageContent }) => (
    <li key={metadata.id}>
      <a href={metadata.url} className="block hover:bg-gray-50">
        <div className="flex items-center px-4 py-4 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center">
            <div className="flex-shrink-0">
              <img
                className="h-12 w-12 rounded-full"
                src={metadata.image}
                alt=""
              />
            </div>
            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
              <div>
                <p className="truncate text-sm font-medium text-indigo-600">
                  {metadata.title}
                </p>
                <p className="mt-2 flex items-center text-sm text-gray-500">
                  <EnvelopeIcon
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <span className="truncate">{metadata.publisher}</span>
                </p>
              </div>
              <div className="hidden md:block">
                <div>
                  <p className="text-sm text-gray-900">
                    Description: {metadata.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <ChevronRightIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
        </div>
      </a>
    </li>
  ))}
</ul>
</div> */
}
