function convertMonthNumberToString(month){
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames[month];
}

function convertDayNumberToString(day) {
    var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return dayNames[day];
}

function getDateSuffix(date) {
    var suffixes = ["st", "nd", "rd", "th", "th", 
                    "th", "th", "th", "th", "th", 
                    "th", "th", "th", "th", "th", 
                    "th", "th", "th", "th", "th", 
                    "st", "nd", "rd", "th", "th", 
                    "th", "th", "th", "th", "th", 
                    "st"];
    return suffixes[date-1];
}

class Event {
    constructor(name, datetime) {
        this.name = name;
        this.datetime = datetime;
    }

    getEventName() {
        return this.name;
    }

    getEventDatetime() {
        return this.datetime;
    }

    getPrettyDate() {
        return convertDayNumberToString(this.datetime.getDay()) + " " + convertMonthNumberToString(this.datetime.getMonth()) + " " + this.datetime.getDate() + getDateSuffix(this.datetime.getDate()) + ", " + this.datetime.getFullYear();
    }

    getShortTime() {
        var ampm = "am";
        var hours = this.datetime.getHours();
        if(hours == 0) {
            hours = 12;
        } else if(hours == 12) {
            ampm = "pm";
        } else if(hours > 12) {
            hours -= 12;
            ampm = "pm"
        }
        var minutes = this.datetime.getMinutes().toString();
        if(minutes.length < 2) {
            minutes = "0" + minutes;
        }

        if(minutes == "00") {
            return hours.toString() + ampm;
        } else {
            return hours.toString() + ":" + minutes + ampm;
        }
    }

    getPrettyTime() {
        var ampm = "am";
        var hours = this.datetime.getHours();
        if(hours == 0) {
            hours = 12;
        } else if(hours == 12) {
            ampm = "pm";
        } else if(hours >= 12) {
            hours -= 12;
            ampm = "pm"
        }
        var minutes = this.datetime.getMinutes().toString();
        if(minutes.length < 2) {
            minutes = "0" + minutes;
        }
        return hours.toString() + ":" + minutes + ampm;
    }

    getPrettyDatetime() {
        var d = this.getPrettyDate();
        var t = this.getPrettyTime();
        return d + " at " + t;
    }
}

module.exports = Event;