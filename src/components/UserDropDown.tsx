import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useUser, useClerk } from "@clerk/clerk-react";

import { classNames } from "~/utils/classNames";

export function UserDropDown() {
  const user = useUser();
  const { signOut } = useClerk();

  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <Menu.Button className="mr-0 flex items-center rounded-lg bg-indigo-600 p-2 px-4 text-sm text-white hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2">
          <span className="sr-only">Wallet</span>
          <p className="">
            {user.isSignedIn ? user.user.firstName : "Sign in"}
          </p>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Fragment>
            <Menu.Item key={"Sign out"}>
              {({ active }) => (
                <a
                  className={classNames(
                    active ? "mr-0 cursor-pointer bg-gray-100" : "",
                    "block px-4 py-2 text-sm text-gray-700"
                  )}
                  onClick={() => {
                    signOut()
                      .then(() => {
                        console.log("logged out");
                      })
                      .catch((error) => {
                        // Handle sign out error, if necessary
                        console.error("Error during sign out:", error);
                      });
                  }}
                >
                  {"Sign out"}
                </a>
              )}
            </Menu.Item>
          </Fragment>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
