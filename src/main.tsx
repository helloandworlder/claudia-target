import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { themeManager } from "./lib/theme-manager";
import { zoomManager } from "./lib/zoom-manager";
import "./styles.css";
import "./assets/shimmer.css";

// 初始化管理器
themeManager;
zoomManager;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
