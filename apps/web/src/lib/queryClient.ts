import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  try {
    const isFormData = data instanceof FormData;
    
    // Use full URL for development to bypass proxy issues
    const fullUrl = url.startsWith('http') ? url : `http://localhost:8080${url}`;
    
    console.log(`Making ${method} request to ${fullUrl}`, {
      isFormData,
      hasData: !!data
    });
    
    const res = await fetch(fullUrl, {
      method,
      headers: (data && !isFormData) ? { "Content-Type": "application/json" } : {},
      body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
      mode: 'cors',
    });

    console.log(`Response: ${res.status} ${res.statusText}`);
    
    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;
    const fullUrl = url.startsWith('http') ? url : `http://localhost:8080${url}`;
    
    const res = await fetch(fullUrl, {
      mode: 'cors',
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
