import { useState, useCallback } from "react";

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<unknown>(null);
  const [lastRequest, setLastRequest] = useState("");

  const execute = useCallback(async <T>(label: string, fn: () => Promise<{ data: T }>) => {
    setLoading(true);
    setError(null);
    setData(null);
    setLastRequest(label);
    try {
      const result = await fn();
      setData(result.data);
      return result.data;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, data, lastRequest, execute };
}
