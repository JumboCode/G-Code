export const DRAWER_WIDTH = 220;

export const formatAMPM = (date_string: string) => {
  var date = new Date(date_string);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  var minutes_str = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes_str + ' ' + ampm;
  return strTime;
}

export const numberToAMPM = (num: number) => {
  var hours = Math.floor(num);
  var minutes = Math.round((num - hours) * 60);
  var amPm = (hours < 12) ? "AM" : "PM";

  if (hours == 0) {
    hours = 12;
  } else if (hours > 12) {
    hours -= 12;
  }

  return hours + ":" + (minutes < 10 ? "0" + minutes : minutes) + " " + amPm;
}

export const numberToMilitary = (num: number) => {
  // Get the integer part of the number
  const hour = Math.floor(num);
  // Get the decimal part of the number and multiply by 60 to get minutes
  const minute = Math.floor((num - hour) * 60);
  // Use string interpolation to format the time string
  const timeString = `${hour}:${minute < 10 ? '0' : ''}${minute}`;
  // Return the military time string
  return timeString;
}

export function convertTimeToNumber(timeString) {
  const [hours, minutes] = timeString.split(':');
  let numericTime = parseInt(hours, 10);
  
  if (timeString.includes('PM') && numericTime !== 12) {
    numericTime += 12;
  }
  
  if (minutes) {
    numericTime += parseInt(minutes, 10) / 60;
  }
  
  return numericTime;
}

export const weekDays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat']

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const dateToString = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

export const student_pages = ["Dashboard", "Assignments", "FAQBoard", "OfficeHours", "People"]

export const admin_pages = ["Dashboard", "Assignments", "FAQBoard", "OfficeHours", "People"]

export const validate_email = (input: string) => { return input && input.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) }

export const validate_string = (input: string) => { return input && input != "" }