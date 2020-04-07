import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';
import {Route, BrowserRouter, Switch} from "react-router-dom"

import CalendarPage from "./components/CalendarPage.js";
import DatePage from "./components/DatePage.js";

class Routing extends React.Component {

  //default behaviour
  getConfirmation(message, callback) {
    const allowTransition = window.confirm(message);
    callback(allowTransition);
  }

  //exact is used as / overwrites everything else if it is first
  render() {
    return (
      <BrowserRouter basename={"/"} getUserConfirmation={this.getConfirmation}>
        <Switch>
          <Route path = {"/"} component = {CalendarPage} exact />
          <Route path = {"/Date"} component = {DatePage} />
          <Route component = {CalendarPage}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<Routing/>, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
