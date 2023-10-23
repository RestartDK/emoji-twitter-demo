import Head from "next/head";
import { useUser } from "@clerk/nextjs";

import { api } from "~/utils/api";


export default function SinglePostPage() {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Start fetching posts
  api.posts.getAll.useQuery();

  // Return empty div if user is not loaded and posts are not loaded
  if (!userLoaded) {
    return <div></div>;
  }

  return (
    <>
      <Head>
        <title>Profile Page</title>
        <meta name="description" content="More about your posts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div>Post View</div>
      </main>
    </>
  );
}
