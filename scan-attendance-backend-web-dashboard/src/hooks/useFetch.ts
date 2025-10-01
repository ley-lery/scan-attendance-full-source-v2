// src/hooks/useFetch.ts
import { useEffect, useState, useCallback } from "react";
import ApiAxios from "@/axios/ApiAxios";

interface UseFetchOptions {
  params?: Record<string, any>;
  deps?: any[];
}

export function useFetch<T = unknown>(url: string, options: UseFetchOptions = {}) {
  const { params = {}, deps = [] } = options;

  const [data, setData] = useState<T | null | any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await ApiAxios.get<T>(url, { params });
      setData(res.data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(params)]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...deps]);

  return { data, loading, error, refetch: fetchData };
}
