import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import './index.css';

import 'bootstrap/dist/css/bootstrap.min.css';


import {  ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";



import Landing from "./pages/landing.jsx"





ReactDOM.render(

  <BrowserRouter basename="/" >
  <ToastContainer />

    <Switch>
    <Route path="/" component={Landing} />
      <Route exact path="/*" component={Landing}>
        <Redirect to="/" />
      </Route>
    </Switch>
  </BrowserRouter>,
    document.getElementById("root")

);


