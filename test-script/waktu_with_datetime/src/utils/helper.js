function convertDateFormat(dateStr) {
  let parts = dateStr.split("/");

  let day = parts[0];
  let month = parts[1];
  let year = parts[2].length === 4 ? parts[2] : `20${parts[2]}`;

  let newFormatDate = `${year}-${month}-${day}`;

  return newFormatDate;
}



module.exports = { convertDateFormat };
