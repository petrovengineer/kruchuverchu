import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.render(
  <Auth0Provider
    domain="dev-pkkepqar.eu.auth0.com"
    clientId="C7VYzWpW1VRAO6CuOWomd1i3w1st0Xnh"
    redirectUri={window.location.origin}
    audience="kruchuverchu.com"
    scope="read:messages"
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);