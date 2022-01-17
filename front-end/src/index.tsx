import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, HashRouter } from "react-router-dom";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA33RYWoxfHTUv1IgMBFQpjPR1WI_tGztA",
  authDomain: "spacestagram-b087a.firebaseapp.com",
  projectId: "spacestagram-b087a",
  storageBucket: "spacestagram-b087a.appspot.com",
  messagingSenderId: "677843588762",
  appId: "1:677843588762:web:758bd235faa2ebfde2f123",
  measurementId: "G-XSK4KEB121",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
