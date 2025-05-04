import React from "react";
import * as ReactDOM from "react-dom/client";
import { HashRouter } from "react-router";
import App from "./App";
import "./App.css";
import "./index.css";
// import reportWebVitals from './reportWebVitals';

// Get the root element and ensure TypeScript knows it cannot be null
const rootElement = document.getElementById("root") as HTMLElement; // Assert that the element is an HTMLElement
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = ReactDOM.createRoot(rootElement);

// Render the application
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);

// Optional: Measure performance
// reportWebVitals();
