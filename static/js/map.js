

document.addEventListener('DOMContentLoaded', function () { 

        const mapboxAccessToken = 'pk.eyJ1IjoiemRzdGVlbGUiLCJhIjoiY2x3MTNrN2VtMDFvMTJqbnJxajZqZHY2dCJ9.4SF57dVEANqV5LqODItFFw';

        var southWest = L.latLng(-62.2, -166); // Adjusted southwest corner
        var northEast = L.latLng(137.8, 164); // Adjusted northeast corner
        var bounds = L.latLngBounds(southWest, northEast);
        
        var map = L.map('map', {
            minZoom: 4, // Set the minimum zoom level here
            maxBounds: bounds // Set the maximum bounds here
        }).setView([37.8, -96], 4);
        

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/dark-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: mapboxAccessToken
    }).addTo(map);

// Define the GeoJSON layers
var pipelineLayer, oilSpillLayer;

// GET PIPELINE INFORMATION
d3.json('/data_pipes').then(function(response) {
    var data = JSON.parse(response);
    
    if (data && Array.isArray(data.features)) {
        // Transform coordinates from EPSG:3857 to EPSG:4326
        data.features.forEach(function(feature) {
            if (feature.geometry && Array.isArray(feature.geometry.coordinates)) {
                var coordinates = feature.geometry.coordinates;
                var transformedCoordinates = coordinates.map(function(coord) {
                    // Check if the coordinates are finite numbers
                    var isValid = coord.every(function(value) {
                        return Number.isFinite(value);
                    });

                    // If the coordinates are valid, transform them
                    if (isValid) {
                        var point = proj4('EPSG:3857', 'EPSG:4326', [coord[0], coord[1]]);
                        return [point[0], point[1]];
                    }

                    // Return null for invalid coordinates
                    return null;
                });

                // Filter out features with invalid coordinates
                transformedCoordinates = transformedCoordinates.filter(function(coord) {
                    return coord !== null;
                });

                feature.geometry.coordinates = transformedCoordinates;
            } else {
                // console.log('Invalid geometry data for feature:', feature);
            }
        });

        // Create a Leaflet GeoJSON layer for pipelines
        pipelineLayer = L.geoJSON(data, {
            style: {
                color: 'blue',
                weight: .5,
                opacity: 1
            }
        });

        // OIL SPILL POINTS
        d3.json('/data').then(function(response) {
            var data = JSON.parse(response);
            
            
            var netLossArray = data.features.map(function(feature) {
                return feature.properties['Net Loss (Barrels)'];
            });

            // Define the legend control
            var legend = L.control({ position: 'bottomright' });

            // Add the legend
            legend.onAdd = function(map) {
            var div = L.DomUtil.create('div', 'legend');
            var labels = ['Aboveground', 'Underground'];
            var colors = ['red', 'purple'];

            for (var i = 0; i < labels.length; i++) {
                div.innerHTML += '<div class="legend-item">' +
                '<svg class="legend-circle" width="12" height="12">' +
                '<circle cx="6" cy="6" r="5" style="fill:' + colors[i] + ';"></circle>' +
                '</svg>' +
                '<span class="legend-label">' + labels[i] + '</span>' +
                '</div>';
            }

            return div;
            };


        // Create the oil spill layer
        var oilSpillLayer = L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            var netLoss = feature.properties['Net Loss (Barrels)'];
            var operatorName = feature.properties['Operator Name'];
            var pipeLineLocation = feature.properties['Pipeline Location'];
            var allCost = feature.properties['All Costs'];
            var pipeLineSurface = feature.properties['Pipeline Type'];

            var circleOptions = {
            radius: Math.sqrt(allCost) * 10,
            fillColor: pipeLineSurface === 'aboveground' ? 'red' : 'purple',
            color: 'white',
            weight: .5,
            opacity: 1,
            fillOpacity: 0.7
            };

            var circle = L.circle(latlng, circleOptions);
            circle.bindPopup(`Operator: ${operatorName}<br>Net Loss: ${netLoss} barrels<br>All Costs: ${allCost}<br>Surface Location: ${pipeLineSurface}`);

            return circle;
        }
        });

            // Add the oil spill layer to the map
            // oilSpillLayer.addTo(map);

            // Add the legend control to the map
            legend.addTo(map);



            // Create a layer control and add the layers to it
            var layerControl = L.control.layers(null, null, { collapsed: false });
            layerControl.addOverlay(pipelineLayer, 'Pipelines');
            layerControl.addOverlay(oilSpillLayer, 'Oil Spill Points');

            // Add the layers to the map
            pipelineLayer.addTo(map);
            oilSpillLayer.addTo(map);

            // Set the default visibility of the layers in the layer control
            map.addControl(layerControl);

            map.on("overlayadd", function (event) {
                oilSpillLayer.bringToFront();
              });

          // Add a title to the map
        var title = L.control({ position: 'topright' });
        title.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'map-title');
        div.innerHTML = '<h3>Costs of Pipeline Failures</h3>';
        return div;
        };

        // Customize the title color
        var titleStyle = document.createElement('style');
        titleStyle.innerHTML = '.map-title h3 { color: #99003d; }';
        document.head.appendChild(titleStyle);

        // Add the title control to the map
        title.addTo(map);
                    // Add the title control to the map
                    title.addTo(map);


        });
    } else {
        // console.log('Invalid GeoJSON data');
    }
});
        
  });

