import { QueryCache, QueryClient } from "react-query";
import { useToasts } from "../util/toasts";
import { APIError } from "./queries";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (err) => {
      if (err instanceof APIError) {
        if (err.status !== 401) {
          useToasts.getState().create({
            type: "error",
            message: err.message,
          });
        }
      } else {
        useToasts.getState().create({
          type: "error",
          message: "An unknown error occurred",
        });
      }
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, err: any) => {
        if (failureCount >= 3) {
          return false;
        }
        return err.status >= 500;
      },
      staleTime: 1000 * 60 * 3,
    },
  },
});

export default queryClient;