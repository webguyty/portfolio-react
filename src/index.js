import React from "react";
import ReactDOM from "react-dom";
import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";
import "./main.scss";

import App from "./App";
import "./scripts/slider";
import "./scripts/scrollSpy";
import sendEmail from "./scripts/sendEmail";
import { showGraph, showData } from "./scripts/graph";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

showGraph();
showData();

// Send message component
document.getElementById("form").addEventListener("submit", (e) => sendEmail(e));
