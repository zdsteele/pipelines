document.addEventListener('DOMContentLoaded', function () {
  // Function to calculate the distance between two points using the Haversine formula

  d3.json('/spill_per_year').then(function (response) {
    var data = JSON.parse(response)

    console.log(data)

    // Create the options for the name dropdown
    var nameOptions = Object.keys(data)

  

      var nameDropdown = d3.select('#operator-name-filter');

      nameDropdown.on('change', function () {
        var selectedOperatorName = this.value
        console.log(selectedOperatorName)
        
      })
   

      // Function to update the chart when a name is selected
      function updateChart () {
        var selectedName = nameDropdown.property('value')
        // console.log(selectedName)
        var yearData = data[selectedName]

        // Check if yearData is valid
        if (
          yearData &&
          typeof yearData === 'object' &&
          Object.keys(yearData).length > 0
        ) {
          // Prepare the data for the bar chart
          var years = Object.keys(yearData)
          console.log(years)
          var values = years.map(function (year) {
            var yearInfo = yearData[year]
            return yearInfo &&
              typeof yearInfo === 'object' &&
              'Net Loss (Barrels)' in yearInfo
              ? yearInfo['Net Loss (Barrels)']
              : 0
          })
          console.log(values)

          // Create the Plotly bar chart
          var trace = {
            x: years,
            y: values,
            type: 'bar'
          }

          var layout = {
            title: `Spill Remediation Costs for ${selectedName}`,
            xaxis: { title: 'Year' },
            yaxis: { title: 'Net Loss (Barrels)' }
          }

          Plotly.newPlot('chart-container', [trace], layout)
        } else {
          // Display an error message or handle the case when data is not available
          // d3.select('#chart-container').html('<p>No data available for the selected name.</p>');
        }
      }

      // Add an event listener to the name dropdown
      nameDropdown.on('change', updateChart)

      // Trigger the initial chart update
      updateChart()
    })
  // })

  // End
})
