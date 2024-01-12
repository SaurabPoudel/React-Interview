import { useState, useRef, useCallback } from "react";
import usePosts from "./hooks/usePosts";
import Post from "./Post";

const Example1 = () => {
  const [pageNum, setPageNum] = useState(1);
  const { loading, isError, error, results, hasMore } = usePosts(pageNum);
  const intObserver = useRef<IntersectionObserver | null>(null);

  const lastPostRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore) {
          console.log("We are near the last post!");
          setPageNum((prevPageNum) => prevPageNum + 1);
        }
      });

      if (node) {
        intObserver.current.observe(node);
      }
    },
    [loading, hasMore]
  );

  if (isError) return <p>Error: {error.message}</p>;

  const content = results.map((post, i) => {
    const isLastPost = results.length === i + 1;

    return (
      <Post
        key={post.id}
        post={post}
        ref={isLastPost ? lastPostRef : undefined}
      />
    );
  });

  return (
    <div className="bg-zinc-900 text-white">
      <div className="bg-black">
        <h1 className="text-3xl pb-3">Infinite Query And Scroll</h1>
      </div>
      {content}
    </div>
  );
};

export default Example1;
