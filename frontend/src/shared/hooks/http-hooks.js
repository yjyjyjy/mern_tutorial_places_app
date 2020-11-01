import { useRef } from "react";
import { useCallback, useEffect, useState } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // not using state because we don't want to rerender when new http request is added. This is just behind the scene stuff.
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      // record all the http requests that have been sent. So in case the component unmount, we can cancel them.
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });
        const responseData = await response.json();
        if (!response.ok) {
          console.log("original message: " + responseData.message);
          throw new Error(responseData.message);
        }
        return responseData;
      } catch (err) {
        setError(err.message || "There is an error without message");
        throw new Error(err);
      } finally {
        setIsLoading(false);
        
        // remove the abort controller since the request is completed.
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (ctrl) => ctrl !== httpAbortCtrl
        );
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return [isLoading, error, sendRequest, clearError];
  // no need to expose isLoading and error's setter method because they are controlled by internal logic.
};
