document.addEventListener('DOMContentLoaded', function () { 

    // BAR GRAPH TOTAL COST PER YEAR
    d3.json('/data_df').then(function(response) {

            var data = JSON.parse(response)
            
            // Data preprocessing - Grouping data by 'Accident Year' and calculating the sum of 'All Costs'
            var dataByYear = Array.from(d3.group(data, d => d['Accident Year']), ([key, value]) => ({ key, value: d3.sum(value, d => d['All Costs']) }));

          // Set up SVG dimensions and margins
            var svgWidth = 600;
            var svgHeight = 500;
            var margin = { top: 40, right: 20, bottom: 40, left: 40 };
            var chartWidth = svgWidth - margin.left - margin.right;
            var chartHeight = svgHeight - margin.top - margin.bottom;

            // Create SVG container
            var svg = d3.select('#bar') // Select the element with ID "bar"
                .append('svg')
                .attr('width', svgWidth)
                .attr('height', svgHeight)
                .style('border', '1px solid black') // Add border to the SVG container
                .style('background-color', '#363b4e'); // Set the background color

            // Create chart group and apply margins
            var chart = svg.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            // Create scales for x and y axes
            var xScale = d3.scaleBand()
                .domain(dataByYear.map(function(d) { return d.key; }))
                .range([0, chartWidth])
                .padding(0.1);

            var yScale = d3.scaleLinear()
                .domain([0, d3.max(dataByYear, function(d) { return d.value; })])
                .range([chartHeight, 0]);

            // Create bars based on the data
            var bars = chart.selectAll('.bar')
                .data(dataByYear)
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('x', function(d) { return xScale(d.key); })
                .attr('y', function(d) { return yScale(d.value); })
                .attr('width', xScale.bandwidth())
                .attr('height', function(d) { return chartHeight - yScale(d.value); })
                .style('fill', '#927fbf'); // COLOR BAR

            // Create x-axis and y-axis
            chart.append('g')
                .attr('class', 'x-axis')
                .attr('transform', 'translate(0,' + chartHeight + ')')
                .call(d3.axisBottom(xScale));

            chart.append('g')
                .attr('class', 'y-axis')
                .call(d3.axisLeft(yScale).tickFormat(d3.format('.2s')));

            // Add x-axis label
            chart.append('text')
                .attr('class', 'x-axis-label')
                .attr('x', chartWidth / 2)
                .attr('y', chartHeight + margin.bottom)
                .style('text-anchor', 'middle')
                .text('Year')
                .style('fill', 'white'); // Set the text color to white

            // Adding Chart title
            chart.append('text')
                .attr('class', 'chart-title')
                .attr('x', chartWidth / 2)
                .attr('y', -margin.top / 2)
                .style('text-anchor', 'middle')
                .text('Oil Spill Costs($) 2010-2017')
                .style('font-weight', 'bold')
                .style('font-size', '16px')
                .style('fill', 'white'); // Set the text color to white

            // Add annotations
            chart.selectAll('.annotation')
                .data(dataByYear)
                .enter()
                .append('text')
                .attr('class', 'annotation')
                .attr('x', function(d) { return xScale(d.key) + xScale.bandwidth() / 2; })
                .attr('y', function(d) { return yScale(d.value) - 5; })
                .attr('text-anchor', 'middle')
                .text(function(d) { return '$' + d3.format('.2s')(d.value); })
                .style('font-size', '12px')
                .style('font-weight', 'bold')
                .style('fill', 'white'); // Set the text color to white
         
    });

    // TOP 3 TABLE
    d3.json('/data_df').then(function(response) {

        var data = JSON.parse(response)
        

         // Sort the data array in descending order based on "All Costs"
        data.sort(function(a, b) {
            return b['All Costs'] - a['All Costs'];
        });

        // Select the table container element
        var tableContainer = d3.select('#table');

        // Create the table element with Bootstrap classes
        var table = tableContainer.append('table')
            .classed('table', true)
            // .classed('table-striped', true)
            .classed(' table-dark', true);
        var thead = table.append('thead');
        var tbody = table.append('tbody');
        
        // Append the label to the table
        table.append('caption')
            .text('Most Expensive Spills');
        
        // Define column headers
        var headers = ['Operator', 'Liquid Type', 'Accident Year', 'All Costs', 'Net Loss (Barrels)'];
        
        // Append the table headers
        thead.append('tr')
            .selectAll('th')
            .data(headers)
            .enter()
            .append('th')
            .text(function(d) { return d; });
        
        // Create table rows and cells
        var rows = tbody.selectAll('tr')
            .data(data.slice(0, 3)) // Select the top 3 objects
            .enter()
            .append('tr');
        
        // Populate the table cells with object properties
        rows.append('td').text(function(d) { return d['Operator Name']; });


         // Populate the table cells with object properties
        rows.append('td').text(function(d) { return d['Liquid Type']; });
        rows.append('td').text(function(d) { return d['Accident Year']; });
        rows.append('td')
            .style('color', '#66ffff') // Set the text color
            .text(function(d) {
            // Format the "All Costs" number with commas
            var formatter = new Intl.NumberFormat('en-US');
            return formatter.format(d['All Costs']);
            });
        rows.append('td').text(function(d) { return d['Net Loss (Barrels)']; });
        

            
    });

    // SCATTER PLOT FOR MONTHLY FREQUENCY 
    d3.json('/data_df').then(function(response){

        var data = JSON.parse(response)
        console.log(data[0]);
                
                // Convert the "Accident Date/Time" values to proper Date objects
        var formattedData = data.map(function (d) {
            return {
            "Accident Date/Time": new Date(d["Accident Date/Time"])
            };
        });
        
        // Extract the month and year from the Date objects
        var monthlyCounts = formattedData.reduce(function (acc, d) {
            var year = d["Accident Date/Time"].getFullYear();
            var month = d["Accident Date/Time"].getMonth() + 1; // Months are zero-based
            var key = year + "-" + month;
        
            if (!acc[key]) {
            acc[key] = { Year: year, Month: month, "Accident Count": 0 };
            }
        
            acc[key]["Accident Count"]++;
            return acc;
        }, {});
        
        // Convert the monthlyCounts object to an array of values
        var monthlyCountsArray = Object.values(monthlyCounts);
        
        // Sort the array by Year and Month
        monthlyCountsArray.sort(function (a, b) {
            return a.Year - b.Year || a.Month - b.Month;
        });
        
        // Extract the Year, Month, and Accident Count arrays for Plotly
        var yearsMonths = monthlyCountsArray.map(function (d) {
            return d.Year + "-" + d.Month;
        });
        var accidentCounts = monthlyCountsArray.map(function (d) {
            return d["Accident Count"];
        });
        
    // Calculate linear regression parameters
    var linearRegression = function (x, y) {
        var n = y.length;
        var sumX = 0;
        var sumY = 0;
        var sumXY = 0;
        var sumXX = 0;
    
        for (var i = 0; i < n; i++) {
        sumX += x[i];
        sumY += y[i];
        sumXY += x[i] * y[i];
        sumXX += x[i] * x[i];
        }
    
        var slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        var intercept = (sumY - slope * sumX) / n;
    
        return {
        slope: slope,
        intercept: intercept
        };
    };
    
    // Extract the x values (yearsMonths) as numbers
    var xValues = yearsMonths.map(function (d) {
        return parseFloat(d);
    });
    
    // Extract the y values (accidentCounts) as numbers
    var yValues = accidentCounts;
    
    // Calculate the trend line values using linear regression
    var regression = linearRegression(xValues, yValues);
    var trendlineY = xValues.map(function (x) {
        return regression.intercept + regression.slope * x;
    });
    
    // Create the trace for the scatter plot
    var trace = {
        x: yearsMonths,
        y: accidentCounts,
        mode: "markers",
        marker: {
        size: 10,
        color: accidentCounts,
        colorscale: "Plasma",
        // showscale: true,
        },
        type: "scatter",
    };
    
    // Create the trace for the trend line
    var trendlineTrace = {
        x: yearsMonths,
        y: trendlineY,
        mode: "lines",
        type: "scatter",
        name: "Trend Line",
        line: {
        color: "#927fbf", // Set the color of the trend line
        width: 2, // Set the width of the trend line
        },
    };
    
    // Create the data array with both traces
    var data = [trace, trendlineTrace];

        // Create the layout for the scatter plot
        var layout = {
            title: "Number of Accidents per Month over Time",
            xaxis: {
              title: "Year-Month",
              tickfont: {
                color: "white" // Set the color of the tick labels to white
              },
              titlefont: {
                color: "white" // Set the color of the axis title to white
              }
            },
            yaxis: {
              title: "Frequency",
              tickfont: {
                color: "white" // Set the color of the tick labels to white
              },
              titlefont: {
                color: "white" // Set the color of the axis title to white
              }
            },
            plot_bgcolor: "#363b4e",  // Set the background color of the plot
            paper_bgcolor: "#222", // Set the background color of the entire plot area
            marker: {
              color: "#927fbf", // Set the color of the markers
            },
            showlegend: false,
          };
    
        // Plot the scatter plot using Plotly
        Plotly.newPlot("scatter-plot", data, layout);


    });
       
    // PIE CHART CAUSES OF SPILLS
    d3.json('data_df').then(function(response){

        var data = JSON.parse(response);

        // Extract the cause categories and count occurrences
        var causes = {};
        data.forEach(function (spill) {
        var cause = spill['Cause Category'];
        causes[cause] = (causes[cause] || 0) + 1;
        });

        // Convert the causes object to arrays for labels and values
        var labels = Object.keys(causes);
        var values = Object.values(causes);

     // Get the "Plasma" color scale
        var colorscale = d3.scaleSequential(d3.interpolatePlasma)
        .domain([0, labels.length - 1]);

        // Create the trace for the pie chart
        var trace = {
        labels: labels,
        values: values,
        type: 'pie',
        marker: {
        colors: labels.map(function (label, index) {
            return colorscale(index);
        }),
        },
        };

        // Create the data array with the pie chart trace
        var data = [trace];

        // Create the layout for the pie chart
        var layout = {
            title: 'Causes of Oil Spills',
            plot_bgcolor: '#363b4e',
            paper_bgcolor: "#222",
            showlegend: false,
            // legend: {
            //     x: 2, // Adjust the x position of the legend
            //     y: 0.5, // Adjust the y position of the legend
            //     orientation: 'h'} // Set the orientation of the legend ('v' for vertical, 'h' for horizontal) // Set the background color of the plot
        };
        // Create the pie chart
        Plotly.newPlot('pie-chart', data, layout);
            })


});

