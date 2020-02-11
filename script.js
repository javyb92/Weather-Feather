$(document).ready(function() {
  var apiKey ="5e8c1329c961bfa711486ebbeb59f577";

  var citiesLocal = JSON.parse(window.localStorage.getItem('cityHistory')) || [] 
  renderButtons()


  //Reloading previous search using .get(-1) to grab last result
  $(document).ready(function renderLastCity(){
    var cityreload= $(citiesLocal).get(-1);
  getDataUpdateHTML(cityreload);
  });

  // Using JSON/Localstorage for quries
  function getDataUpdateHTML(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;
    var query5dayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;
    //Top module script, displays today info
    $.ajax({url: queryURL, method: "GET"}).then(function (response) {
          $("#city").html("<h1>Weather in " + response.name + "</h1>");
          $("#temp").html("<h2>" + Math.ceil (response.main.temp) + " degrees" + "</h2>");
          $("#cond").html("<h3>" + response.weather[0].main + "</h3>");
          $("#humidity").html("<h2>"+ "Humidity " + Math.ceil (response.main.humidity) + "</h2>");
          $("#wind").html(" <h2>" + Math.ceil(response.wind.speed) + " mph" + "</h2>");
    
    //Long & Lat coordinates grabbed from queryURL for UV Index api 
            var lonCoordinates = response.coord.lon;
            var latCoordinates = response.coord.lat;
            var uvindexURL= "http://api.openweathermap.org/data/2.5/uvi?"+ "appid=" +apiKey + "&lat="+ latCoordinates +"&lon="+ lonCoordinates; 
    
            // UV Index api, then displays with top module
          $.ajax({url: uvindexURL, method: "GET"}).then(function (response) {
          $("#uvIndexValue").html(" <h2>" + "UV Index: "+ response.value + "</h2>");
              // console.log(response);
          })
      })

    //Bottom module script, displays 5 day forecast info
    $.ajax({url: query5dayURL, method: "GET"}).then(function (response) {
      //console.log(response)
          $("#forcastday1").html("<p>" + "Tomorrow"+"</p>"+"<p>"+ "Hi "  + Math.ceil(response.list[0].main.temp_max) + " / Lo"+ Math.ceil(response.list[0].main.temp_min)+ "</p>" + "<p>"+"Humidity "+ response.list[0].main.humidity + "%"+"</p>");
          $("#forcastday2").html("<p>" + response.list[8].dt_txt + "</p>" + "<p>"+ "Hi "  + Math.ceil(response.list[8].main.temp_max)  +  "</p>" + "<p>"+"Humidity " + response.list[8].main.humidity + "%"+"</p>");
          $("#forcastday3").html("<p>" + response.list[16].dt_txt + "</p>" + "<p>"+ "Hi " + Math.ceil(response.list[16].main.temp_max) + "</p>" + "<p>"+"Humidity "  + response.list[16].main.humidity + "%"+"</p>");
          $("#forcastday4").html("<p>" + response.list[24].dt_txt + "</p>" + "<p>" + "Hi "+ Math.ceil(response.list[24].main.temp_max) +  "</p>" + "<p>"+"Humidity " + response.list[24].main.humidity + "%"+"</p>");
          $("#forcastday5").html("<p>" + response.list[32].dt_txt + "</p>" + "<p>"+ "Hi " + Math.ceil(response.list[32].main.temp_max) +  "</p>" + "<p>"+"Humidity " + response.list[32].main.humidity + "%"+"</p>");         
      })
  }

  // Search function, click search to execute
  $("#searchCity").on("click", function (event) { 
    var city = $("#citySearch-input").val();
    citiesLocal.push(city)
    window.localStorage.setItem('cityHistory', JSON.stringify(citiesLocal));
    event.preventDefault();
    getDataUpdateHTML(city)
    renderButtons()

  });
  
  $(".buttons-view").on("click", "button", function(event) { 
    var city = $(event.target).data('city');
    getDataUpdateHTML(city)
  });

  // render buttons work in progress, need to get rid of duplicates and null
  function renderButtons() {
    var city= $("#citySearch-input").val().trim();
    $(".buttons-view").empty();

    for (var i = 0; i < citiesLocal.length; i++) { 
      $(".buttons-view").append(
        '<button data-city=' + citiesLocal[i] + ' class="historybtn">' 
        + citiesLocal[i] + 
        '</button>'
      );
  }
}
//Clear Button, with page refresh ability
    $("#clearButton").on("click", function clearButton(){
    window.localStorage.clear();
    location.reload(true);
    console.log("Button is clicked");
    });
});
