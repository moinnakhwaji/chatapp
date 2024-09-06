import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { CssBaseline } from "@mui/material";
import store from "./redux/store.js"
import { Provider } from "react-redux";
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <CssBaseline />
      {/* <div className="html bg-black" onContextMenu={(e)=>e.preventDefault()}> */}
    
      <App />
      {/* </div> */}
    </Provider>
  </React.StrictMode>
);
