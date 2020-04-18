import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';
import {Route, BrowserRouter, Switch} from "react-router-dom"

import CalendarPage from "./components/CalendarPage.js";
import DatePage from "./components/DatePage.js";

var cron = require('node-cron');

class Routing extends React.Component {

  //default behaviour
  getConfirmation(message, callback) {
    const allowTransition = window.confirm(message);
    callback(allowTransition);
  }

  //exact is used as / overwrites everything else if it is first
  render() {
    cron.schedule('* * * * 4 *', () => {
      console.log('running every minute 1, 2, 4 and 5');
    //  curl 'https://website-4484d.firebaseio.com/.json?format=export' >> output.txt
    });
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
