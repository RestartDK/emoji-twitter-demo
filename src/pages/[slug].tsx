import Head from "next/head";
import Image from "next/image";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import SuperJSON from "superjson";

import { db } from "~/server/db";
import { api } from "~/utils/api";
import Layout from "~/components/layout";
import { LoadingPage } from "~/components/loading";
import PostView from "~/components/postview";

type StaticProps = InferGetStaticPropsType<typeof getStaticProps>;

export async function getStaticProps(
  context: GetStaticPropsContext<{ slug: string }>,
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { db, userId: null },
    transformer: SuperJSON, // optional - adds superjson serialization
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await helpers.profile.getUserByUsername.prefetch({ username: username });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      username,
    },
    revalidate: 1,
  };
}

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

function ProfileFeed(props: {userID: string}) {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({userID: props.userID});

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!data || data.length === 0) {
    return <div>User has not posted!</div>;
  }

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );

}

export default function ProfilePage({ username }: StaticProps) {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) {
    return <div>404 Not found</div>;
  }

  console.log(data);

  return (
    <>
      <Head>
        <title>Profile Page</title>
        <meta name="description" content="Learn more aboout you" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="relative h-48 border-b border-slate-400 bg-slate-600">
          <Image
            src={data.imageUrl}
            alt={`@${data.username}'s profile pic`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-xl font-bold">{`@${data.username ?? ""}`}</div>
        <div className="border-b w-full border-slate-400"></div>
        <ProfileFeed userID={data.id}/>
      </Layout>
    </>
  );
}
