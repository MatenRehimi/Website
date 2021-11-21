import React from "react";
import "./styles/DatePage.css";
import TaskList from "./TaskList.js";
import firebase from "../Firebase";

class DatePage extends React.Component {
  //order of execution: constructor, componentWillMount, render, componentDidMount
  constructor(props) {
    super(props);
    const tempDate = this.props.location.state.selectedDate.split("/").join("");
    this.state = {
      date: tempDate,
    };
  }

  getOptionPicked(event) {
    const { date } = this.state;
    firebase
      .database()
      .ref("Calendar Page")
      .child(date.slice(4, 8) + "_" + date.slice(2, 4) + "_" + date.slice(0, 2))
      .child("Day Rating")
      .set(event.target.value);
  }

  renderDatePage() {
    const { date } = this.state;
    return (
      <div className="date">
        <header>
          <h1>
            <center>{date.slice(0, 2) + "/" + date.slice(2, 4) + "/" + date.slice(4, 8)}</center>
          </h1>
        </header>
        <TaskList type="Mental" position="leftBlock" props={this.state} />
        <TaskList type="Physical" position="leftMiddleBlock" props={this.state} />
        <TaskList type="Health" position="rightMiddleBlock" props={this.state} />
        <TaskList type="Long Term Goals" position="rightBlock" props={this.state} />
        <center>
          <div className="optionsContainer" onChange={this.getOptionPicked.bind(this)}>
            <div>
              <input id="firstOption" type="radio" name="options"/>
              <label className="black-label" htmlFor="firstOption"> x </label>
            </div>
            <div>
              <input id="secondOption" type="radio" name="options"/>
              <label className="red-label" htmlFor="secondOption"> x </label>
            </div>
            <div>
              <input id="thirdOption" type="radio" name="options"/>
              <label className="black-label" htmlFor="thirdOption"> ✓ </label>
            </div>
            <div>
              <input id="fourthOption" type="radio" name="options"/>
              <label className="red-label" htmlFor="fourthOption"> ✓ </label>
            </div>
            <div>
              <input id="warningOption" type="radio" name="options"/>
              <label className="red-label" htmlFor="warningOption"> ! </label>
            </div>
            <div>
              <input id="clearOption" type="radio" name="options"/>
              <label className="black-label" htmlFor="clearOption"> Clear </label>
            </div>
          </div>
        </center>
      </div>
    );
  }

  render() {
    return this.renderDatePage();
  }
}

export default DatePage;
