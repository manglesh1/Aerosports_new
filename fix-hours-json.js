function fixHoursJson() {
  var ss = SpreadsheetApp.openById('1B_9EaTQDztWGH_cD3lUP7hpWD6FvNBJ-6Czml2x7d9c');
  var sheet = ss.getSheetByName('locations');
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var hoursCol = headers.indexOf('hours') + 1;
  var locCol = headers.indexOf('location') + 1;
  var count = 0;

  for (var i = 1; i < data.length; i++) {
    var hours = data[i][hoursCol - 1];
    if (typeof hours === 'string' && hours.trim()) {
      var fixed = hours.replace(/,\s*]/g, ']');
      if (fixed !== hours) {
        sheet.getRange(i + 1, hoursCol).setValue(fixed);
        Logger.log('Fixed trailing comma for: ' + data[i][locCol - 1]);
        count++;
      }
    }
  }
  Logger.log('Total fixed: ' + count);
}
