

module.exports.getDate = () => {
  var today = new Date();

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  }
  
  var day = today.toLocaleString("en-us", options);
  return `Fuck me, its already ${day}`;
};

module.exports.getDay = () => {
  var today = new Date();

  const options = {
    weekday: "long",
  }
  
  var day = today.toLocaleString("en-us", options);
  return `Fuck me, its already ${day}.`;
};