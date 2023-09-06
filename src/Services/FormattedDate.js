const formatDateToUUKK = date => {
  var hours = date.getHours().toString().padStart(2, '0');
  var minutes = date.getMinutes().toString().padStart(2, '0');
  return hours + ':' + minutes;
};

export default formatDateToUUKK;
