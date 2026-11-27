import { useEffect, useState } from "react";

export default function useApi<T>(request: () => Promise<{ data: T }>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError("");

    request()
      .then((response) => {
        if (active) {
          setData(response.data);
        }
      })
      .catch(() => {
        if (active) {
          setError("Unable to load data. Check the API.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [request]);

  return { data, loading, error };
}
