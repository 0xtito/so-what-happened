import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  SignIn,
  SignInButton,
  SignOutButton,
  useUser,
} from "@clerk/clerk-react";
import { api } from "~/utils/api";
import { useEffect } from "react";

import { DashboardLayout } from "~/layouts/DashboardLayout";

const Home: NextPage = () => {
  const user = useUser();
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  useEffect(() => {
    if (user.isSignedIn) {
      console.log("User id: ", user.user?.id);
      // const data = api.user.getUserInfo.useQuery({ userId: user.user?.id! });
      // console.log("User data: ", data);
    }
  }, [user.isSignedIn]);

  return (
    <>
      <Head>
        <title>So What Happended</title>
        <meta name="description" content="So What Happened" />
      </Head>
      {user.isSignedIn ? (
        <DashboardLayout></DashboardLayout>
      ) : (
        <main className="flex min-h-screen flex-col items-center justify-center">
          <div>
            {!user.isSignedIn && <SignInButton />}
            {!!user.isSignedIn && <SignOutButton />}
          </div>
        </main>
      )}
    </>
  );
};

export default Home;

{
  /* <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e7dbe] to-[#0d0e32]">
        <div>
          {!user.isSignedIn && <SignInButton />}
          {!!user.isSignedIn && <SignOutButton />}
        </div>
      </main> */
}
