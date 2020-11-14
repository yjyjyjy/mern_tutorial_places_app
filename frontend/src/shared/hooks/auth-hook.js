import { useState, useCallback, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
  const [authToken, setAuthToken] = useState();
  const [currentUserId, setCurrentUserId] = useState();
  const [tokenExpirationTime, setTokenExpirationTime] = useState();

  const login = useCallback((uid, token, expiration) => {
    setAuthToken(token);
    setCurrentUserId(uid);
    if (!expiration) {
      expiration = new Date(new Date().getTime() + 1000 * 60 * 60); // an hour
    }
    setTokenExpirationTime(expiration);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        currentUserId: uid,
        authToken: token,
        expiration: expiration.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    setTokenExpirationTime(null);
    setCurrentUserId(null);
    localStorage.removeItem("userData");
  }, []);

  // check auth token first upon waking up.
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.authToken &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.currentUserId,
        storedData.authToken,
        new Date(storedData.expiration)
      );
    }
  }, []);

  // // set a timer to log out when the timer expires
  useEffect(() => {
    if (authToken && tokenExpirationTime) {
      const remainingTimeInMs =
        tokenExpirationTime.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTimeInMs);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [authToken, logout, tokenExpirationTime]);

  return [authToken, currentUserId, login, logout];
};
