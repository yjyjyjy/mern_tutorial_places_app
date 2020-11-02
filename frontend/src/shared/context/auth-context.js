import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  currentUserId: null,
  login: () => {}, // the actual login handler is in the App.js file
  logout: () => {},
});
