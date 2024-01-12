import { useState, useEffect } from "react";
import { getPostsPage } from "../api/axios";

type Erorr = {
  message: string;
};

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
  ref: React.RefObject<HTMLDivElement>;
};

const usePosts = (pageNum = 1) => {
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Erorr>({ message: "" });
  const [isError, setIsError] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    setIsError(false);
    setError({ message: "" });

    const controller = new AbortController();
    const { signal } = controller;
    getPostsPage(pageNum, { signal })
      .then((data) => {
        setResults((prev) => [...prev, ...data]);
        setHasMore(Boolean(data.length));
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        if (signal.aborted) return;
        setIsError(true);
        setError({ message: e.message });
      });
    return () => controller.abort();
  }, [pageNum]);
  return { results, loading, isError, error, hasMore };
};

export default usePosts;
