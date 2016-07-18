var model = {};

model.rules = {};

model.validate = function(data, ruleset) {
  return model.rules[ruleset].run(data);
}

model.mapData = function(data, primary, secondary) {
  if (!data.length || data.length === 1) return data;
  var mappedData = {};
  data.forEach(function(record, i){
    for (field in record) {
      if (field.substr(0, primary.length) === primary) {
        mappedData[field.substr(primary.length+1)] = record[field];
      } else if (field.substr(0, secondary.length) === secondary) {
        if (!mappedData[secondary]) mappedData[secondary] = [];
        if (!mappedData[secondary][i]) mappedData[secondary][i] = {};
        mappedData[secondary][i][field.substr(secondary.length+1)] = record[field];
      }
    }
  });
  return mappedData;
}

module.exports = model;
