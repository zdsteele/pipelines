document.addEventListener('DOMContentLoaded', function () {
  // Function to calculate the distance between two points using the Haversine formula


  d3.json('/spill_per_year').then(function (response) {

    var data = JSON.parse(response);

    console.log(data)

  })

  // End
})
