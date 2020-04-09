import React from "react";
import dateFns from "date-fns";
import {Redirect} from "react-router-dom"
import firebase from '../Firebase';

class Calendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentMonth: new Date(),
      selectedDate: new Date(),
      dayRatings: "",
      redirect: false
    };
  }

  async componentDidMount() {
    const dayRatings = await this.findDayRatings("Schedule")
    this.setState({
      dayRatings:dayRatings
    })
    console.log(dayRatings)
  }

  async findDayRatings(type) {
    const {currentMonth} = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);
    let day = startDate;
    console.log(day)
    let x = [];

    while (day < endDate) {
      if (dateFns.isSameMonth(day,monthStart)) {
        x.push(await this.findDayRating(day,type))
      }
      day = dateFns.addDays(day, 1);
    }
    console.log(typeof(x))
    return x;
  }

  async findDayRating(day,type) {
    let val = "";
    day = dateFns.format(day, "YYYY MM DD");
    await firebase.database().ref('calendar').child(day.substring(0,4)).child(day.substring(5,7)).child(day.substring(8,10)).child(type).child("dayRating")
    .once("value",snapshot => {
      if (snapshot.exists()) {
        val = snapshot.val()
      }else{
        return ""
      }
    })
    if(val==="firstOption") { return <div><span style={{color: "black"}}><b>x</b></span></div>}
    else if (val==="secondOption") { return <div><span style={{color: "Red"}}><b>x</b></span></div>}
    else if (val==="thirdOption") { return <div><span style={{color: "black"}}>{"✓"}</span></div>}
    else if (val==="fourthOption") { return <div><span style={{color: "red"}}>{"✓"}</span></div>}
    else return "";
  }

  renderHeader() {
    const dateFormat = "MMMM YYYY";
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>{dateFns.format(this.state.currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "dddd";
    const days = [];

    let startDate = dateFns.startOfWeek(this.state.currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="days row">{days}</div>;
  }

  renderCells() {
    const { currentMonth, selectedDate } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "D";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";
    let x = this.state.dayRatings;
    let p = -1;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        if (dateFns.isSameMonth(day,monthStart)) {
          p++;
        }

        const cloneDay = day;
        days.push(
          <div
            className={`col cell ${
              !dateFns.isSameMonth(day, monthStart)
                ? "disabled"
                : dateFns.isSameDay(day, selectedDate) ? "selected" : ""
            }`}
            key={day}
            onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
          >
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
            {dateFns.isSameMonth(day,monthStart) ? x[p] : ""}
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  }


  onDateClick = day => {
    this.setState({
      selectedDate: day,
      redirect: true
    });
  };

  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    });
  };

  prevMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect push to={{
        pathname: "/Date",
        state: { selectedDate: dateFns.format(this.state.selectedDate,'DD/MM/YYYY') }
      }}/>
    }

    return (
      <div className="calendar">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
      </div>
      );
    }
  }

export default Calendar;
