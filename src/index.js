import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

var Schedule = require("./Schedule.js");
var Event = require("./Event.js");

function convertMonthNumberToString(month){
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames[month];
}

function getLastDayOfMonth(year, month) {
    return new Date(year, month+1, 0)
}

class NavButton extends React.Component {
    render () {
        return (
            <div id={this.props.id}>
                <button className="nav-button" onClick={this.props.onClick}>{this.props.text}</button>
            </div>
        );
    }
}

class CalendarEventModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            time: null,
        }
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleNameChange(event) {
        this.setState({name: event.target.value});
    }

    handleTimeChange(event) {
        this.setState({time: event.target.value});
    }
    
    resetState() {
        this.setState({name: null, time: null});
    }

    prettifyDate(date) {
        return convertMonthNumberToString(date.getMonth()) + " " + date.getDate() + ", " + date.getFullYear();
    }

    onSubmit(event) {
        if(this.state.name && this.state.time) {
            var t = this.props.date;
            var parts = this.state.time.split(":");
            var hours = parts[0];
            var minutes = parts[1];
            t.setHours(hours);
            t.setMinutes(minutes);
            this.props.addEventCallback(this.state.name, t);
            this.resetState();
        }
        this.onClose(event);
    }

    onClose = e => {
        this.props.onClose && this.props.onClose(e);
    }
    render() {
        if(this.props.show) {
            return (
                <div className="modal">
                    <h2>Add event for {this.prettifyDate(this.props.date)}</h2>
                    
                    <div className="content">
                        <label>Name: </label>
                        <input name="eventName" type="text" value={this.state.name} maxLength="40" onChange={this.handleNameChange} autoFocus/>
                        <br/>
                        <br/>
                        <label>Time: </label>
                        <input name="time" type="time" value={this.state.time} onChange={this.handleTimeChange}/>
                    </div>
                    
                    <div className="actions">
                        <input value="Save" type="submit" onClick={e => this.onSubmit()}/>
                        <button onClick={(e) => this.onClose(e)}>Cancel</button>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}

class Day extends React.Component {
    showEventDialog() {
       this.props.showEventModalCallback(this.props.date);
    }

    deleteEventHandler(e, ev) {
        e.stopPropagation();
        var result = window.confirm("Are you sure you want to delete " + ev.getEventName() + "?");
        if(result) {
            this.props.deleteEventCallback(ev, this.props.date);
        }
    }

    render() {
        var today = new Date();
        var num;
        var cssClass;
        if(today.getMonth() !== this.props.date.getMonth()) {
            cssClass = "day"
            num = <div className="other-month-day-number">{this.props.date.getDate()}</div>
        } else 
        if(today.getDate() === this.props.date.getDate() && today.getMonth() === this.props.date.getMonth() && today.getFullYear() === this.props.date.getFullYear()) {
            cssClass = "current-day";
            num = <div className="current-day-number">{this.props.date.getDate()}</div>
        }
        else {
            cssClass = "day";
            num = <div className="day-number">{this.props.date.getDate()}</div>
        }
        var eventsOfToday = this.props.getEventsCallback(this.props.date);
        if(eventsOfToday != null) {
            eventsOfToday.sort((a,b) => (a.getEventDatetime() > b.getEventDatetime()) ? 1 : -1);
            var evnts = eventsOfToday.map((ev) => <div className="eventList"><div onClick={e => this.deleteEventHandler(e, ev)}>{ev.getShortTime() + " " + ev.getEventName()}</div></div>);
            return (
                <div className={cssClass} onClick={ () => this.showEventDialog() }>
                    {num}
                    {evnts}
                </div>
            );
            
        } else {
            return (
                <div className={cssClass} onClick={ () => this.showEventDialog() }>
                    {num}
                </div>
            );
        }        
    }
}

class WeekHeader extends React.Component {
    render() {
        return (
            <table className="week-header">
                <tbody>
                    <tr>
                        <th>Sunday</th>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                        <th>Friday</th>
                        <th>Saturday</th>
                    </tr>
                </tbody>
            </table>
        );
    }
}

class Week extends React.Component {
    render() {
        var days = this.props.dates.map((day) => <Day date={day} 
                                                      showEventModalCallback={(date) => this.props.showEventModalCallback(date)} 
                                                      getEventsCallback={(date) => this.props.getEventsCallback(date)}
                                                      deleteEventCallback={(name, date) => this.props.deleteEventCallback(name, date)}></Day>);
        return (
            <div>
                {days}
            </div>
        );
    }
}

function incrementDate(dateString) {
    var date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date;
}

function decrementDate(dateString) {
    var date = new Date(dateString);
    date.setDate(date.getDate() - 1);
    return date;
}

function getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = new Date(startDate);
    var endDate = new Date(stopDate);
    while (currentDate <= endDate) {
        dateArray.push(new Date (currentDate));
        currentDate = incrementDate(currentDate);
    }
    return dateArray;
}

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: props.date,
            schedule: new Schedule(),
            showModal: false,
            modalDate: null,
        };
    }

    showModal(date) {
        this.setState({showModal: true, modalDate: date});
    }

    hideModal() {
        this.setState({showModal: false});
    }

    showEventModalCallback(date) {
        this.showModal(date);
    }

    addEventCallback(name, date) {
        this.setState({schedule: this.state.schedule.addEvent(name, date)});
    }

    getEventsCallback(date) {
        return this.state.schedule.getEventsForDay(date);
    }

    deleteEventCallback(name, date) {
        this.setState({schedule: this.state.schedule.deleteEvent(name, date)});
    }

    render() {
        var firstOfMonth = new Date(this.state.date.getFullYear(), this.state.date.getMonth(), 1);
        var startDate = firstOfMonth;
        var endDate = getLastDayOfMonth(this.state.date.getFullYear(), this.state.date.getMonth())
        while(startDate.getDay() !== 0) {
            startDate = decrementDate(startDate);
        }
        while(endDate.getDay() !== 6) {
            endDate = incrementDate(endDate);
        }
        var monthAsDates = getDates(startDate, endDate);
        let weeks = [];
        for(var i = 0; i < monthAsDates.length; i+=7){
            weeks.push(monthAsDates.slice(i,i+7))
        }
        var weekRows = weeks.map((wk) => <Week dates={wk} 
                                               showEventModalCallback={(date) => this.showEventModalCallback(date)} 
                                               getEventsCallback={(date) => this.getEventsCallback(date)}
                                               deleteEventCallback={(name, date) => this.deleteEventCallback(name, date)}>
                                         </Week>);
        return (
            <div className="calendar">
                <div className="cal-header">{convertMonthNumberToString(this.state.date.getMonth())} {this.state.date.getFullYear()}</div>
                <WeekHeader></WeekHeader>
                {weekRows}
                <CalendarEventModal show={this.state.showModal} 
                                    onClose={() => this.hideModal()} 
                                    date={this.state.modalDate} 
                                    addEventCallback={(name, date) => this.addEventCallback(name, date)}>Hello world</CalendarEventModal>
            </div>
        );
    }
}

function prevMonth(date) {
   date.setMonth(date.getMonth() - 1);
   return date;
}

function nextMonth(date) {
    date.setMonth(date.getMonth() + 1);
    return date;
}


class Display extends React.Component {
    constructor(props) {
        super(props);
        var today = new Date();
        this.state = {
            currentDate: today,
        }
    }

    clickPrev() {
        console.log("clicked next");
        this.setState({currentDate: prevMonth(this.state.currentDate)});
        console.log("new state: " + this.state.currentDate);

    }

    clickNext() {
        console.log("clicked next");
        this.setState({currentDate: nextMonth(this.state.currentDate)});
        console.log("new state: " + this.state.currentDate);
    }

    render() {
        return (
            <div className="display">
                <Calendar date={this.state.currentDate}></Calendar>
                <NavButton id="prevButton" text="&#x276E;" onClick={() => this.clickPrev()}></NavButton>
                <NavButton id="nextButton" text="&#x276F;" onClick={() => this.clickNext()}></NavButton>
            </div>
        )
    }
}

// ========================================
  
  ReactDOM.render(<Display/>, document.getElementById("root"));
  
  