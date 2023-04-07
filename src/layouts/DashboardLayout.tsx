import React, { Fragment } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useUser } from "@clerk/clerk-react";
import { UserDropDown } from "~/components/UserDropDown";
import { ArticlesListSection } from "~/components/ArticlesListSection";
import { ArticleChatSection } from "~/components/ArticleChatSection";
import { InitialArticleRequest } from "~/components/InitialArticleRequest";
import { VerticalDivider } from "~/components/VerticalDivider";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// { children }: DashboardLayoutProps

export function DashboardLayout() {
  const user = useUser();

  // {!!user.isSignedIn && <SignOutButton />}

  return (
    <Fragment>
      {/*
          This example requires updating your template:
  
          ```
          <html class="bg-white">
          ```
        */}
      <div className="flex min-h-screen flex-col">
        <header className="mx-0 border-b border-gray-200 bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <div className="flex items-center gap-x-8">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-300"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>
              {/* <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your profile</span>
                <img
                  className="h-8 w-8 rounded-full bg-gray-800"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </a> */}
              <UserDropDown />
            </div>
          </div>
        </header>
        {/* flex max-w-screen-xl mx-auto grow items-start gap-x-8 px-8 py-10 */}
        <div className="flex w-full grow items-start gap-x-4 px-8 py-10">
          <aside className="sticky top-8 hidden max-h-screen shrink-0 border-r-slate-400 lg:block">
            <ArticlesListSection />
          </aside>

          <VerticalDivider />

          <main className="max-h-[calc(100vh-25vh)] flex-1 overflow-y-auto">
            <InitialArticleRequest />
          </main>

          <VerticalDivider />

          <aside className="top-8 hidden max-h-[calc(100vh-25vh)] w-96 shrink-0 overflow-y-auto xl:block">
            <ArticleChatSection />
          </aside>
        </div>
      </div>
    </Fragment>
  );
}
