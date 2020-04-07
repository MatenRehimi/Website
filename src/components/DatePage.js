import React from 'react';
import './styles/DatePage.css';
import TaskList from "./TaskList.js";

class DatePage extends React.Component {

  //order of execution: constructor, componentWillMount, render, componentDidMount
  constructor(props) {
    super(props);
    const tempDate = this.props.location.state.selectedDate.toString();
    this.state = {
      day: tempDate.substring(0,2),
      month: tempDate.substring(3,5),
      year: tempDate.substring(6,10),
      date: tempDate
    }
  }

  renderDatePage() {
    const formattedDate = this.props.location.state.selectedDate.toString();
    return (
      <div className = "date">
        <header>
          {
            <h1>
              <center>{formattedDate}</center>
           </h1>
          }
        </header>
        <main>
          <TaskList type="Schedule" position="leftBlock" props={this.state}/>
          <TaskList type="Gym" position="rightBlock" props={this.state}/>
        </main>
      </div>
    );
  }

  render() {
      return this.renderDatePage();
  }
}

export default DatePage;