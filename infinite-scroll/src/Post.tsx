import React from "react";

interface PostProps {
  post: {
    title: string;
    body: string;
    id: number;
  };
}

const Post = React.forwardRef(({ post }: PostProps, ref) => {
  const postBody = (
    <div className="bg-black text-green-500 border-2 border-zinc-700 rounded">
      <p>Post ID: {post.id}</p>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
    </div>
  );

  const content = ref ? (
    //@ts-ignore
    <article ref={ref}>{postBody}</article>
  ) : (
    <article>{postBody}</article>
  );
  return content;
});

export default Post;
