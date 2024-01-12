import { useRef, useCallback } from "react";
import Post from "./Post";
import { useInfiniteQuery } from "react-query";
import { getPostsPage } from "./api/axios";
import { Post as PostType } from "./hooks/usePosts";

const Example2 = () => {
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data,
    status,
    error,
  } = useInfiniteQuery(
    "/posts",
    ({ pageParam = 1 }) => getPostsPage(pageParam),
    {
      getNextPageParam: (lastPage, allPapges) => {
        return lastPage.length ? allPapges.length + 1 : undefined;
      },
    }
  );
  const intObserver = useRef<IntersectionObserver | null>(null);

  const lastPostRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetchingNextPage) return;
      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage) {
          console.log("We are near the last post!");
          fetchNextPage();
        }
      });

      if (node) {
        intObserver.current.observe(node);
      }
    },
    [isFetchingNextPage, hasNextPage]
  );

  if (status === "error") {
    if (error instanceof Error) {
      return <p>Error: {error.message}</p>;
    }
    return <p>An unknown error occurred.</p>;
  }

  const content = data?.pages.map((results: PostType[]) => {
    return results.map((post, i) => {
      const isLastPost = results.length === i + 1;

      return (
        <Post
          key={post.id}
          post={post}
          ref={isLastPost ? lastPostRef : undefined}
        />
      );
    });
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

export default Example2;
