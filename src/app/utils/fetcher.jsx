import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export function useFetch(url) {
  const { data, error, isLoading } = useSWR(
    `http://localhost:8080/api/${url}`,
    fetcher
  );

  return {
    data,
    isLoading,
    error,
  };
}
