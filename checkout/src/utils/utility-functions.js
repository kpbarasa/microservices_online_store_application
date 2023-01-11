// Get full date y/m/d  
module.exports.getDate = () => {
  var date = new Date(),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2)
  day = ("0" + date.getDate()).slice(-2)
  hours = ("0" + date.getHours()).slice(-2)
  min = ("0" + date.getMinutes()).slice(-2)
  secs = ("0" + date.getSeconds()).slice(-2)
  return date.getFullYear() + "" + [mnth + "" + day].join(",");
}


// // Get full date y/m/d/h/m/s
module.exports.fullDate = () => {
  var date = new Date(),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2)
  day = ("0" + date.getDate()).slice(-2)
  hours = ("0" + date.getHours()).slice(-2)
  min = ("0" + date.getMinutes()).slice(-2)
  secs = ("0" + date.getSeconds()).slice(-2)
  return date.getFullYear() + "" + [mnth + "" + day + "" + hours + "" + min + "" + secs].join(",");
}