import React, { useState, useCallback, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Users from "./user/pages/Users";
import NewPlace from "./place/pages/NewPlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlaces from "./place/pages/UserPlaces";
import UpdatePlace from "./place/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";

let logoutTimer;

const App = () => {
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

  let routes;

  if (!!authToken) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId" exact>
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!authToken,
        authToken: authToken,
        currentUserId: currentUserId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
