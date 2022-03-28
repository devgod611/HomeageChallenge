import { SLOT_TIME } from './constants';

// 240 (min)-> 04:00 (hour:min)
export const convertMinuteToHourMin = function(totalMinutes) {
    let hours = Math.floor(totalMinutes / SLOT_TIME);    
    hours = hours.toString().padStart(2, "0");      
    let minutes = totalMinutes % SLOT_TIME;
    minutes = minutes.toString().padStart(2, "0");      
    return `${hours}:${minutes}:00`;
}

// param: 
//  slots: already booked slot numbers
//  selected_book: when editing a reservation, slot number for selected user
// this function returns avaliable slot numbers
export const getTimeSlots = function(_slots, selected_book) {
    const booked_slots = _slots.data.booked_slots;
    const total_nurses = Number(_slots.data.total_nurses);
    let array = [];
    for(let minute = 0; minute < 1440; minute += SLOT_TIME) {
        let valid = true;
        booked_slots.forEach(element => {
            if(Number(element.slot_number) === Number(minute/SLOT_TIME) && Number(selected_book) !== Number(element.slot_number)) {
                valid = false;
            }
        });
        if(total_nurses === 0) valid = false;
        
        array.push({
            avaiable: valid,
            time: convertMinuteToHourMin(minute)
        });
    }
    return array;
}

// returns time from slot number
export const getTimeFromSlot = function(slot_number) {
    if(slot_number >= 0) {
        return getTimeSlots({data: { booked_slots: [], total_nurses: 1 }})[slot_number].time;
    }
    else return "";
}