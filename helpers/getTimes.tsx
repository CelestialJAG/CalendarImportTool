
export function getTimes(date, googleEvents){
    var timeSlots = [];
    var startHour = new Date(date);
    var endHour = new Date(date);
    var schedule = [];
    let startTime = googleEvents.startTime;
    let endTime = googleEvents.endTime;
    
    startHour.setHours(8, 0, 0, 0); //start schedules at 8am
    endHour.setHours(23, 0, 0, 0); //end schedules at 11pm

    for(let i=startTime; i<endTime; i++){
        schedule[i] = "busy"; //fill each busy slot, indexes with null are free
    }

    do{
        if (schedule[startHour.getHours()] == null) //check if slot is empty
            timeSlots.push(startHour) //add free times to timeslot array
        startHour.setHours(startHour.getHours()+1, 0, 0, 0); //cycle to next hour
    }
    while(startHour < endHour); //loop until end of day (11pm)

    return timeSlots;
}