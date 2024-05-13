document.addEventListener('DOMContentLoaded', function () { 

    // CORRELATION BETWEEN BARRELS SPILT AND REMEDIATION COSTS
    d3.json('data_df').then(function(response){

    //     var data = JSON.parse(response);

    //     // Filter the data to remove zero or negative values
    //     var filteredData = data.filter(function(d) {
    //       return d['Net Loss (Barrels)'] > 0 && d['All Costs'] > 0;
    //     });
        
    //     // Extract the 'Net Loss (barrels)' and 'All Costs' values
    //     var xValues = filteredData.map(function(d) {
    //       var value = d['Net Loss (Barrels)'];
    //       return isNaN(value) ? null : value;
    //     });
        
    //     var yValues = filteredData.map(function(d) {
    //       var value = Math.log(d['All Costs']);
    //       return isNaN(value) ? null : value;
    //     });
        
    //     // Create a trace for the scatter plot
    //     var trace = {
    //       x: xValues,
    //       y: yValues,
    //       mode: 'markers',
    //       type: 'scatter',
    //       marker: {
    //         color: 'blue'
    //       }
    //     };
        
    //     // Function to calculate linear regression
    //     function linearRegression(xValues, yValues) {
    //       var n = xValues.length;
    //       var sumX = 0;
    //       var sumY = 0;
    //       var sumXY = 0;
    //       var sumX2 = 0;
        
    //       for (var i = 0; i < n; i++) {
    //         sumX += xValues[i];
    //         sumY += yValues[i];
    //         sumXY += xValues[i] * yValues[i];
    //         sumX2 += xValues[i] * xValues[i];
    //       }
        
    //       var meanX = sumX / n;
    //       var meanY = sumY / n;
    //       var numerator = sumXY - n * meanX * meanY;
    //       var denominator = sumX2 - n * meanX * meanX;
        
    //       var slope = numerator / denominator;
    //       var intercept = meanY - slope * meanX;
        
    //       return { slope: slope, intercept: intercept };
    //     }
        
    //     // Perform linear regression
    //     var regression = linearRegression(xValues, yValues);
        
    //     console.log(regression);
        
    //     // Extract slope and intercept
    //     var slope = regression.slope;
    //     var intercept = regression.intercept;
        
    //     // Generate x and y values for the regression line
    //     var xRegression = [Math.min(...xValues), Math.max(...xValues)];
    //     var yRegression = xRegression.map(function(x) {
    //       return slope * x + intercept;
    //     });
        
    //     console.log(xRegression);
    //     console.log(yRegression);
        
    //     // Create a trace for the trend line
    //     var trendLine = {
    //       x: xRegression,
    //       y: yRegression,
    //       mode: 'lines',
    //       type: 'scatter',
    //       marker: {
    //         color: 'red'
    //       }
    //     };
        
    //     // Generate the equation for the trend line
    //     var equation = 'y = ' + slope.toFixed(2) + 'x + ' + intercept.toFixed(2);
        
    //     console.log(equation);
        
    //     // Create an annotation for the slope equation
    //     var annotation = {
    //       xref: 'paper',
    //       yref: 'paper',
    //       x: 0.5, // Position the annotation at the center of the x-axis
    //       y: 1,   // Position the annotation at the top of the y-axis
    //       text: equation,
    //       showarrow: false,
    //       font: {
    //         family: 'Arial',
    //         size: 12,
    //         color: 'blue'
    //       }
    //     };
        
    //    // Define the layout for the scatter plot
    //     var layout = {
    //         title: 'Scatter Plot with Trend Line',
    //         xaxis: {
    //         title: 'Log Net Loss (Barrels)',
    //         type: 'log',
    //         range: [Math.log(1), Math.log(Math.max(...xValues))] // Specify the desired range for the x-axis
    //         },
    //         yaxis: {
    //         title: 'Log All Costs',
    //         type: 'log',
    //         range: [Math.log(1), Math.log(Math.max(...yValues))] // Specify the desired range for the y-axis
    //         },
    //         plot_bgcolor: "#363b4e",
    //         paper_bgcolor: "#222",
    //         annotations: [annotation] // Add the slope equation annotation to the layout
    //     };
                
    //     // Create the plot using Plotly
    //     Plotly.newPlot('correlation', [trace, trendLine], layout);

    //     // plot_bgcolor: "#363b4e",  // Set the background color of the plot
    //     // paper_bgcolor: "#222", // Set the background color of the entire plot area
        
     })

});
