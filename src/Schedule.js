var Event = require("./Event.js")

class Schedule {
    constructor() {
        this.schedule = new Map();
    }

    makeKeyFromDate(datetime) {
        var keystring = datetime.getFullYear().toString() + datetime.getMonth().toString() + datetime.getDate().toString();
        return parseInt(keystring);

    }

    addEvent(eventName, datetime) {
        if(this.schedule.has(datetime)) {
            return this;
        } else {
            var evnt = new Event(eventName, datetime);
            var key = this.makeKeyFromDate(datetime);
            var eventsOfDay = this.getEventsForDay(datetime);
            if(eventsOfDay) {
                eventsOfDay.push(evnt)
                this.schedule = this.schedule.set(key, eventsOfDay);
            } else {
                this.schedule = this.schedule.set(key, [evnt]);
            }
            console.log("added " + eventName + " on " + key);
            return this;
        }
    }

    findEventInList(event, list) {
        for(var i = 0; i < list.length; i++) {
            if(list[i].getEventName() == event.getEventName()) {
                return i;
            }
        }
        return -1;
    }

    deleteEvent(event, datetime) {
        var events = this.getEventsForDay(datetime);
        var i = this.findEventInList(event, events);
        if(i > -1) {
            events.splice(i, 1);
            var key = this.makeKeyFromDate(datetime);
            this.schedule = this.schedule.set(key, events);
        }
        return this;
    }

    getEventsForDay(date) {
        var key = this.makeKeyFromDate(date);
        if(this.schedule.has(key)) {
            return this.schedule.get(key);
        } else {
            return null;
        }
    }

    keys() {
        return this.schedule.keys()
    }

}

module.exports = Schedule;