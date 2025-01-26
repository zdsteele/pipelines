// document.addEventListener('DOMContentLoaded', function () {

//   d3.json('/data').then(function (response) {
//     var data = JSON.parse(response)

// console.log(data)
//         // Get the unique operator names
//         var uniqueOperatorNames = Array.from(
//             new Set(
//               data.features.map(function (feature) {
//                 return feature.properties['Operator Name']
//               })
//             )
//           )
      
//           // Sort the operator names alphabetically
//           uniqueOperatorNames.sort()
      
//           // Get the existing select element
//           var operatorNameFilter = d3.select('#operator-name-filter')
      
//           // Add the operator name options
//           uniqueOperatorNames.forEach(function (operatorName) {
//             operatorNameFilter
//               .append('option')
//               .attr('value', operatorName)
//               .text(operatorName)
//           })
      
//     })
  
// })
document.addEventListener('DOMContentLoaded', function () {
  d3.json('/data').then(function (response) {
    var data = JSON.parse(response)


    // Get the unique years
    var uniqueYears = Array.from(
      new Set(
        data.features.map(function (feature) {
          var accidentDateTime = feature.properties['Accident Date/Time'];
          var accidentDate = new Date(accidentDateTime);
          return accidentDate.getFullYear();
        })
      )
    )

    // Sort the years in ascending order
    uniqueYears.sort();

    // Get the existing select element
    var yearFilter = d3.select('#year-filter');

    // Add the year options
    uniqueYears.forEach(function (year) {
      yearFilter
        .append('option')
        .attr('value', year)
        .text(year);
    });

  });
});