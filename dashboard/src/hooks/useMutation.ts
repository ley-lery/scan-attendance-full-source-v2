import ApiAxios from "@/axios/ApiAxios";
import { useState, useCallback } from "react";

type MutationOptions<R> = {
  onSuccess?: (data: R) => void;
  onError?: (error: any) => void;
  onSettled?: () => void;
};

// Generic hook for mutations
export function useMutation<T = any, R = any>(options?: MutationOptions<R>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<R | null>(null);

  const mutate = useCallback(
    async (
      url: string,
      payload?: T,
      method: "POST" | "PUT" | "DELETE" = "POST"
    ) => {
      try {
        setLoading(true);
        setError(null);

        let response;
        switch (method) {
          case "POST":
            response = await ApiAxios.post<R>(url, payload);
            break;
          case "PUT":
            response = await ApiAxios.put<R>(url, payload);
            break;
          case "DELETE":
            response = await ApiAxios.delete<R>(url, { data: payload });
            break;
        }

        setData(response?.data || null);
        options?.onSuccess?.(response?.data as R); // trigger success callback
        return response?.data;

      } catch (err: any) {
        
        setError(err.message || "Something went wrong");
        options?.onError?.(err); // trigger error callback
        throw err;
      
      } finally {
      
        setLoading(false);
        options?.onSettled?.(); // always run
      
      }
    },
    [options]
  );

  return { mutate, data, loading, error };
}
