document.addEventListener('DOMContentLoaded', function () {
  // Creating the Map
  const mapboxAccessToken =
    'pk.eyJ1IjoiemRzdGVlbGUiLCJhIjoiY202NDNjanZzMWNmeTJ2cHk5NmhmeGJkcyJ9.LQOFJFUkr6h7Lalj95r4Rg'

  var southWest = L.latLng(-62.2, -166) // Adjusted southwest corner
  var northEast = L.latLng(137.8, 164) // Adjusted northeast corner
  var bounds = L.latLngBounds(southWest, northEast)

  var map = L.map('map', {
    minZoom: 4, // Set the minimum zoom level here
    maxBounds: bounds // Set the maximum bounds here
  }).setView([37.8, -96], 4)

  L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/dark-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: mapboxAccessToken
    }
  ).addTo(map)

  // Add a title to the map
  var title = L.control({ position: 'topright' })
  title.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'map-title')
    div.innerHTML = '<h4> Radius based on volumn of barrels spilled</h4>'
    return div
  }

  // Customize the title color
  var titleStyle = document.createElement('style')
  titleStyle.innerHTML = '.map-title h4 { color: #f8f8f8; }'
  document.head.appendChild(titleStyle)

  var layerControl = L.control.layers(null, null, { collapsed: false })

  // Add the title control to the map
  title.addTo(map)

  // Define the GeoJSON layers
  var oilpipelineLayer
  var gaspipeLayer

  // GET NATRUAL GAS PIPELINE INFORMATION
  d3.json('/gas_pipelines').then(function (response) {
    var data = JSON.parse(response)

    if (data && Array.isArray(data.features)) {
      // Transform coordinates from EPSG:3857 to EPSG:4326
      data.features.forEach(function (feature) {
        if (feature.geometry && Array.isArray(feature.geometry.coordinates)) {
          var coordinates = feature.geometry.coordinates
          var transformedCoordinates = coordinates.map(function (coord) {
            // Check if the coordinates are finite numbers
            var isValid = coord.every(function (value) {
              return Number.isFinite(value)
            })

            // If the coordinates are valid, transform them
            if (isValid) {
              var point = proj4('EPSG:3857', 'EPSG:4326', [coord[0], coord[1]])
              return [point[0], point[1]]
            }

            // Return null for invalid coordinates
            return null
          })

          // Filter out features with invalid coordinates
          transformedCoordinates = transformedCoordinates.filter(function (
            coord
          ) {
            return coord !== null
          })

          feature.geometry.coordinates = transformedCoordinates
        }
      })
    }

    // Create a Leaflet GeoJSON layer for pipelines
    gaspipeLayer = L.geoJSON(data, {
      style: {
        color: '#dbdb14',
        weight: 0.3,
        opacity: 0.75
      }
    })

    layerControl.addOverlay(gaspipeLayer, 'Gas Pipelines')
    gaspipeLayer.addTo(map)
    layerControl.addTo(map)
  })

  // GET OIL PIPELINE INFORMATION
  d3.json('/oil_pipelines').then(function (response) {
    var data = JSON.parse(response)

    if (data && Array.isArray(data.features)) {
      // Transform coordinates from EPSG:3857 to EPSG:4326
      data.features.forEach(function (feature) {
        if (feature.geometry && Array.isArray(feature.geometry.coordinates)) {
          var coordinates = feature.geometry.coordinates
          var transformedCoordinates = coordinates.map(function (coord) {
            // Check if the coordinates are finite numbers
            var isValid = coord.every(function (value) {
              return Number.isFinite(value)
            })

            // If the coordinates are valid, transform them
            if (isValid) {
              var point = proj4('EPSG:3857', 'EPSG:4326', [coord[0], coord[1]])
              return [point[0], point[1]]
            }

            // Return null for invalid coordinates
            return null
          })

          // Filter out features with invalid coordinates
          transformedCoordinates = transformedCoordinates.filter(function (
            coord
          ) {
            return coord !== null
          })

          feature.geometry.coordinates = transformedCoordinates
        }
      })
    }

    // Create a Leaflet GeoJSON layer for pipelines
    oilpipelineLayer = L.geoJSON(data, {
      style: {
        color: '#40ff00',
        weight: 0.4,
        opacity: 1
      }
    })
  })

  // OIL SPILL POINTS
  d3.json('/data').then(function (response) {
    var data = JSON.parse(response)

    // Define the colorRanges and getColor function
    var colorRanges = [
      { range: [0, 500], color: '#ffffcc' },
      { range: [501, 1000000], color: '#ffcc99' },
      { range: [1000001, 2000000], color: '#ff9966' },
      { range: [2000001, 3000000], color: '#ff6600' },
      { range: [3000001, Infinity], color: '#ff0000' }
    ]

    function getColor (allCost) {
      var colorRange = colorRanges.find(function (range) {
        return allCost >= range.range[0] && allCost <= range.range[1]
      })

      return colorRange ? colorRange.color : 'gray'
    }

    // Generate the legend HTML
    var legend = L.control({ position: 'bottomright' })

    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'legend')
      var labels = []

      // Generate legend labels and colors
      colorRanges.forEach(function (range) {
        var colorCircle =
          '<span style="display:inline-block;border-radius:50%;width:12px;height:12px;background-color:' +
          range.color +
          '"></span>'
        var minRange = range.range[0].toLocaleString()
        var maxRange =
          range.range[1] !== Infinity ? range.range[1].toLocaleString() : '+'
        var label =
          '<div>' +
          colorCircle +
          ' $' +
          minRange +
          ' &ndash; $' +
          maxRange +
          '</div>'
        labels.push(label)
      })

      // Add legend title and labels to the div
      div.innerHTML = '<h6>Spill Remediation Costs</h6>' + labels.join('')

      return div
    }

    // Add the legend to the map
    legend.addTo(map)
    // Apply CSS to shrink the legend
    var legendContainer = document.querySelector('.legend')
    legendContainer.style.fontSize = '12px' // Adjust the font size
    legendContainer.style.padding = '5px 10px' // Adjust the padding
    legendContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'

    var oilSpillLayer = L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        var netLoss = feature.properties['Net Loss (Barrels)']
        var operatorName = feature.properties['Operator Name']
        var pipeLineLocation = feature.properties['Pipeline Location']
        var allCost = feature.properties['All Costs']
        var pipeLineSurface = feature.properties['Pipeline Type']
        var mediumType = feature.properties['Liquid Type']
        // Assuming the "Accident Date/Time" string is stored in a feature property
        var accidentDateTime = feature.properties['Accident Date/Time']

        // Create a new Date object from the string
        var accidentDate = new Date(accidentDateTime)

        // Extract the year from the Date object
        var accidentYear = accidentDate.getFullYear()

        // Add the accidentYear to the feature.properties object
        feature.properties['accidentYear'] = accidentYear

        var circleOptions = {
          radius: Math.sqrt(netLoss) * 1000,
          fillColor: getColor(allCost),
          color: 'white',
          weight: 0.5,
          opacity: 1,
          fillOpacity: 0.7
        }
        var circle = L.circle(latlng, circleOptions)
        circle.bindPopup(
          `Operator: ${operatorName}
        <br>Net Loss: ${netLoss} barrels
        <br>All Costs: $${allCost.toLocaleString()}
        <br>Surface Location: ${pipeLineSurface}
        <br>Medium Type: ${mediumType}<br>Year: ${accidentYear}`
        )

        return circle
      }
    })

    // Get the existing select element
    var yearFilter = d3.select('#year-filter')

    // Store the original data
    var originalData = data.features
    

    // Add event listener to the select element
    yearFilter.on('change', function () {
      var selectedYear = this.value
      updateMap(selectedYear)
      // updateChart(selectedYear)
    })

    function updateMap (year) {
      if (year === '') {
        // Reset the data to the original data
        data.features = originalData
      } else {
        // Filter the data based on the selected year
        data.features = originalData.filter(function (feature) {
          return feature.properties['accidentYear'] === parseInt(year)
        })
      }

      // Update the GeoJSON layer with the filtered data
      oilSpillLayer.clearLayers()
      oilSpillLayer.addData(data)
    }

    function updateChart (operatorName) {
      d3.json('/spill_per_year').then(function (response) {
        var data = JSON.parse(response)

        if (operatorName === '') {
          // Hide the chart-container
          d3.select('#chart-container').style('display', 'none')
        } else {
          // Show the chart-container
          d3.select('#chart-container').style('display', 'block')

          // Function to update the chart when a name is selected
          var yearData = data[operatorName]

          // Check if yearData is valid
          if (
            yearData &&
            typeof yearData === 'object' &&
            Object.keys(yearData).length > 0
          ) {
            // Prepare the data for the bar chart
            var years = Object.keys(yearData)
            var values = years.map(function (year) {
              var yearInfo = yearData[year]
              return yearInfo &&
                typeof yearInfo === 'object' &&
                'Net Loss (Barrels)' in yearInfo
                ? yearInfo['Net Loss (Barrels)']
                : 0
            })

            // Create the Plotly bar chart
            var trace = {
              x: years,
              y: values,
              type: 'bar'
            }

            var layout = {
              title: `Spill Remediation Costs for ${operatorName}`,
              xaxis: { title: 'Year' },
              yaxis: { title: 'Net Loss (Barrels)' }
            }

            Plotly.newPlot('chart-container', [trace], layout)
          } else {
            // Display an error message or handle the case when data is not available
            d3.select('#chart-container').html(
              '<p>No data available for the selected name.</p>'
            )
          }
        }
      })
    }
    // Create the layer control
    layerControl.addOverlay(oilSpillLayer, 'Spill Points')
    layerControl.addOverlay(oilpipelineLayer, 'Oil Pipelines')
    // layerControl.addOverlay(gaspipeLayer, 'Gas Pipelines');

    // Add the layer control to the map
    layerControl.addTo(map)

    // Add the layers to the map
    oilSpillLayer.addTo(map)
    oilpipelineLayer.addTo(map)
    // gaspipeLayer.addTo(map);

    // Set the default visibility of the layers in the layer control
    map.addControl(layerControl)

    map.on('overlayadd', function (event) {
      oilSpillLayer.bringToFront()
    })
  })
})
