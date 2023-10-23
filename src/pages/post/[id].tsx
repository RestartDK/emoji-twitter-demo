import Head from "next/head";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";

import { api } from "~/utils/api";
import Layout from "~/components/layout";
import PostView from "~/components/postview";
import generateServerSideHelper from "~/server/helpers/serverSideHelper";

type StaticProps = InferGetStaticPropsType<typeof getStaticProps>;

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>,
) {
  const helpers = generateServerSideHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await helpers.posts.getByID.prefetch({ id: id });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
    revalidate: 1,
  };
}

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default function SinglePostPage({ id }: StaticProps) {
  const { data } = api.posts.getByID.useQuery({ id });

  // Start fetching posts
  api.posts.getAll.useQuery();

  // Return empty div if user is not loaded and posts are not loaded
  if (!data) {
    return <div>404 Not Found</div>;
  }

  return (
    <>
      <Head>
        <title>{`${data?.post.content} - ${data?.author.username}`}</title>
        <meta name="description" content="More about your posts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <PostView {...data}/>
      </Layout>
    </>
  );
}
