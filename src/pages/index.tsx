import Link from "next/link";
import Image from "next/image";
import { SignInButton, useUser } from "@clerk/nextjs";

import { api } from "~/utils/api";

import { LoadingPage } from "~/components/loading";
import { LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
import Layout from "~/components/layout";
import PostView from "~/components/postview";

function PostWizard() {
  const { isSignedIn, user } = useUser();
  const [input, setInput] = useState("");
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.log(errorMessage);
      if (errorMessage?.[0]) {
        toast.error(errorMessage[0]);
        return;
      } else {
        toast.error("Failed to post!");
      }
    },
  });

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="flex w-full gap-4">
      <Image
        src={user.imageUrl}
        alt="Profile image"
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <input
        placeholder="Type something here!"
        className="grow bg-transparent outline-none"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
      />
      {input !== "" && !isPosting && (
        <button onClick={() => mutate({ content: input })}>Post</button>
      )}

      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
}



function Feed() {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) {
    return <LoadingPage />;
  }

  if (!data) {
    return <div>Something went wrong!</div>;
  }

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
}

export default function Home() {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Start fetching posts
  api.posts.getAll.useQuery();

  // Return empty div if user is not loaded and posts are not loaded
  if (!userLoaded) {
    return <div></div>;
  }

  return (
    <>
      <Layout>
        <div className="flex border-b border-slate-400 p-4">
          {!isSignedIn && (
            <div className="flex justify-center">
              <SignInButton />
            </div>
          )}
          {isSignedIn && <PostWizard />}
        </div>
        <Feed />
      </Layout>
    </>
  );
}
