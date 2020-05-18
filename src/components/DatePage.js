import React from 'react';
import './styles/DatePage.css';
import TaskList from "./TaskList.js";
import firebase from '../Firebase';


class DatePage extends React.Component {

  //order of execution: constructor, componentWillMount, render, componentDidMount
  constructor(props) {
    super(props);
    const tempDate = this.props.location.state.selectedDate;
    this.state = {
      day: tempDate.substring(0,2),
      month: tempDate.substring(3,5),
      year: tempDate.substring(6,10),
      date: tempDate
    }
  }

  getOptionPicked(event) {
    const {day,month,year} = this.state;
    firebase.database().ref("dayRating").child(year).child(month)
    .child(day).set(event.target.value)
  }

  renderDatePage() {
    const {date} = this.state;
    return (
      <div className = "date">
        <header>
            <h1>
              <center>{date}</center>
           </h1>
        </header>
        <main>
          <TaskList type="Mental" position="leftBlock" props={this.state}/>
          <TaskList type="Physical" position="leftMiddleBlock" props={this.state}/>
          <TaskList type="Health" position="rightMiddleBlock" props={this.state}/>
          <TaskList type="Long Term Goals" position="rightBlock" props={this.state}/>
        </main>
        <center>
        <div className="options"onChange={this.getOptionPicked.bind(this)}>
          <input className="option" type="radio" name="pick" value="firstOption"/><b style={{color:"black"}}>x</b>
          <input className="option" type="radio" name="pick" value="secondOption"/><b style={{color:"red"}}>x</b>
          <input className="option" type="radio" name="pick" value="thirdOption"/><label style={{color:"black"}}>✓</label>
          <input className="option" type="radio" name="pick" value="fourthOption"/><label style={{color:"red"}}>✓</label>
          <input className="option" type="radio" name="pick" value="fifthOption"/><label style={{color:"red"}}><b>!</b></label>
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
