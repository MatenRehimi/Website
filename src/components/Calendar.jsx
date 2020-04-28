import React from "react";
import dateFns from "date-fns";
import {Redirect} from "react-router-dom"
import firebase from '../Firebase';

class Calendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
      dayRatingSchedule: "",
      dayRatingGym: "",
      redirect: false
    };
  }

  async componentDidMount() {
    try {
      const {selectedDate} = this.state
      const [dayRatingSchedule,dayRatingGym] = await Promise.all([this.findDayRatings("Schedule",selectedDate),this.findDayRatings("Gym",selectedDate)])
      this.setState({
        dayRatingSchedule:dayRatingSchedule,
        dayRatingGym:dayRatingGym
      })
    } catch(error) {
      console.log(error)
    }
  }

  async findDayRatings(type,date) {
    try {
      const formattedDay = dateFns.format(date,"YYYY MM");
      let dayRatings = [];
      await firebase.database().ref(type).child("dayRating").child(formattedDay.substring(0,4)).child(formattedDay.substring(5,7))
      .once("value",snapshot => {
        if (snapshot.exists()) {
          dayRatings = snapshot.val()
        }
      })
      return dayRatings
    }catch(error) {
      console.log(error)
    }
}

  renderHeader() {
    const dateFormat = "MMMM YYYY";
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevMonth.bind(this)}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>{dateFns.format(this.state.selectedDate, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={this.nextMonth.bind(this)}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "dddd";
    const days = [];

    let startDate = dateFns.startOfWeek(this.state.selectedDate);

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
    const {selectedDate,dayRatingSchedule, dayRatingGym} = this.state;
    const monthStart = dateFns.startOfMonth(selectedDate);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "D";
    const dayFormat = "DD";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";
    let formattedDay = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        if (dateFns.isSameMonth(day,monthStart)){
          formattedDay = dateFns.format(day,dayFormat);
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
            {this.convertOptionsToElements(dayRatingSchedule[formattedDay])}
            {this.convertOptionsToElements(dayRatingGym[formattedDay])}
          </div>
        );
        day = dateFns.addDays(day, 1);
        formattedDay = "";
      }
      rows.push(<div className="row" key={day}> {days} </div>);
      days = [];
    }
    return <div className="body">{rows}</div>;
  }

  convertOptionsToElements(key) {
    var dict = {
      "firstOption": <span style={{color: "black"}}><b>x</b></span>,
      "secondOption": <span style={{color: "red"}}><b>x</b></span>,
      "thirdOption": <span style={{color: "black"}}>{"✓"}</span>,
      "fourthOption": <span style={{color: "red"}}>{"✓"}</span>
    };
    return dict[key]

  }

  onDateClick(day) {
    this.setState({
      selectedDate: day,
      redirect: true
    });
  };

  nextMonth() {
    let nextMonth = dateFns.addMonths(this.state.selectedDate,1);
    this.setState({
      selectedDate: nextMonth,
      dayRatingSchedule: this.findDayRatings("Schedule",nextMonth),
      dayRatingGym: this.findDayRatings("Gym",nextMonth)
    }, () => {
      this.componentDidMount()
    });

  }

  prevMonth() {
    let prevMonth = dateFns.subMonths(this.state.selectedDate, 1);
    this.setState({
      selectedDate: prevMonth,
      dayRatingSchedule: this.findDayRatings("Schedule",prevMonth),
      dayRatingGym: this.findDayRatings("Gym",prevMonth)

    }, () => {
      this.componentDidMount()
    });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect push to={{
        pathname: "/Date",
        state: { selectedDate: dateFns.format(this.state.selectedDate,'DD/MM/YYYY').toString() }
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
