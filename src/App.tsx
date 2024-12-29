// src/App.jsx

import React from "react";
import Editor from "./Editor";

function App() {
  return (
    <div>
      <Editor
        init={{
          toolbar: "bold italic underline strikethrough | font | color bgColor",
        }}
      />
    </div>
  );
}

export default App;
