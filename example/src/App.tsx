// example/App.jsx

import React from "react";
import { Routes, Route } from "react-router";
import DemoPage from "./DemoPage";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DemoPage demoType="inline" />} />
      <Route path="/inline" element={<DemoPage demoType="inline" />} />
      <Route path="/headless" element={<DemoPage demoType="headless" />} />
      <Route path="/topbar" element={<DemoPage demoType="topbar" />} />
    </Routes>
  );
};

export default App;
