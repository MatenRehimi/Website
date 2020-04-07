import React from 'react';
import Calendar from "./Calendar.jsx";
import './styles/CalendarPage.css';

class CalendarPage extends React.Component {

  render() {
    return (
      <div className="App">
        <header>
          <div id="logo">
            <span className="icon">date_range</span>
            <span>
              My <b>calendar</b>
            </span>
          </div>
        </header>
        <main>
          <Calendar/>
        </main>
      </div>
    );
  }
}

export default CalendarPage;
