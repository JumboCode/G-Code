export const DRAWER_WIDTH = 220;

export const formatAMPM = (date_string: string) => {
  var date = new Date(date_string);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

export const numberToAMPM = (num: number) => {
  console.log(num)
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

export const weekDays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat']

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const dateToString = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}