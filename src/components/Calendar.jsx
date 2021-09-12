import React from "react";
import dateFns from "date-fns";
import {Redirect} from "react-router-dom"
import firebase from '../Firebase';
import {getDatabase,ref,query,orderByKey,onValue,startAt,endAt} from 'firebase/database'

class Calendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
      dayRating: "",
      redirect: false
    };
  }

  componentDidMount() {
    try {
      const {selectedDate} = this.state
      this.findDayRatings("dayRating",selectedDate).then((dayRating) => {
        this.setState({dayRating});
      })
      
    } catch(error) {
      console.log(error)
    }
  }

  findDayRatings = (type,date) => {
    return new Promise((resolve,reject) => {
      const formattedDay = dateFns.format(date,"YYYY_MM_");
      const firstDayOfMonth = formattedDay+"01";
      const lastDayOfMonth = formattedDay+dateFns.getDaysInMonth(this.state.selectedDate);
      
      let dayRating = [];
      const db = getDatabase(firebase);

      var query1 = query(ref(db,"Calendar Page"),orderByKey())
      var query2 = query(query1,startAt(firstDayOfMonth))
      var query3 = query(query2, endAt(lastDayOfMonth))

      onValue(query3, (snapshot) => {
        if (snapshot.exists()) {
          dayRating = snapshot.val();
          resolve(dayRating)
        }else{
          resolve([])
        }
      })
    })
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
    const {selectedDate,dayRating} = this.state;
    const monthStart = dateFns.startOfMonth(selectedDate);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "D";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";
    let formattedDay = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        if (dateFns.isSameMonth(day,monthStart)){
          formattedDay = dateFns.format(day,"YYYY_MM_DD");
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
            {dayRating[formattedDay]
              ? this.convertOptionsToElements(Object.values(dayRating[formattedDay]))
              : ""}
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
      "fourthOption": <span style={{color: "red"}}>{"✓"}</span>,
      "fifthOption": <label style={{color:"red"}}><b>!</b></label>
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
      dayRating: this.findDayRatings("dayRatings",nextMonth),
    }, () => {
      this.componentDidMount()
    });
  }

  prevMonth() {
    let prevMonth = dateFns.subMonths(this.state.selectedDate, 1);
    this.setState({
      selectedDate: prevMonth,
      dayRating: this.findDayRatings("dayRatings",prevMonth),
    }, () => {
      this.componentDidMount()
    });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect push to={{
        pathname: "/Date",
        state: { selectedDate: dateFns.format(this.state.selectedDate,'DD/MM/YYYY').toString()}
      }}/>
    }
    

    if (this.state.dayRating == null) {
      return (<div>Loading</div>)
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
