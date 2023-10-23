import Link from "next/link";
import Image from "next/image";

import type { RouterOutputs } from "~/utils/api";


import dayjs from "dayjs";
import relateTime from "dayjs/plugin/relativeTime";

dayjs.extend(relateTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export default function PostView(props: PostWithUser) {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex gap-4 border-b border-slate-400 p-4">
      <Image
        src={author.imageUrl}
        alt={`@${author.username}'s profile picture`}
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <div className="flex flex-col font-bold">
        <div>
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span> <span> · </span>{" "}
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{dayjs(post.createdAt).fromNow()}</span>
          </Link>
        </div>
        <span className="text-xl">{post.content}</span>
      </div>
    </div>
  );
}