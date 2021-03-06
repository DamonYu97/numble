import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {HashRouter, Route, Routes} from "react-router-dom";
import EasyModeComponent from "./ components/easyMode";
import HardModeComponent from "./ components/hardMode";

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
        <Routes>
            <Route path="/" element={<App/>}></Route>
            <Route path="/easy" element={<EasyModeComponent/>}></Route>
            <Route path="/hard" element={<HardModeComponent/>}></Route>
        </Routes>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
