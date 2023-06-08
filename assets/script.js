var inputEl = $(".city-input");
var currentWeatherEl = $("#current-weather");
var forecastEl = $("#forecast");
var recentCity = $("#recent-city");
var cityEl = $('#cityname');
var dateEl = $('#currentdate');
var standInMsg = $('#standby-msg');
var forecastBox = $('.forecast-box')
var weatherBox = $('#currentWeatherBox');

function clearPage() {
   cityEl.html('');
   dateEl.html('');
   currentWeatherEl.html('');
  forecastBox.html('');
}

function getCurrentWeather() { 
    clearPage();
    standInMsg.remove();
    var cityInput = inputEl.val();
    var date = moment().format("DD/MM/YYYY")

    localStorage.setItem("recentcity", cityInput)

    fetch("https://www.mapquestapi.com/geocoding/v1/address?key=JgWvLdgBrNVGSTkR4kIyGDAmLg2LVUkK&location=" + cityInput)
    .then(function(response) {
        console.log(response);
        return response.json()
 })
 .then(function(data) {
     var lat = data.results[0].locations[0].latLng.lat.toString();
     var lng = data.results[0].locations[0].latLng.lng.toString();

     fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&lon="+ lng + "&exclude=minutely,hourly&appid=e5b1844529612dd15add6a3867ed6a86&units=imperial") 
     .then(function (response) {
         return response.json();
    })
    .then(function (data) {
        // creating elements for data to go in
        var cityName = $('<h1>');    
        var temp = $('<p>');   
        var humidity = $('<p>');
        var wind = $('<p>');
        var icon = data.current.weather[0].icon
        var uv = $('<span>').attr("background-color", "gray");
        var iconUrl = " https://openweathermap.org/img/wn/" + icon + "@2x.png";
        // giving the elements the text I wan =t them to have via the api data
        $('.icon').attr('src', iconUrl).css('background-color', 'rgb(22 79 163 / 61%)');
        cityName.text(cityInput.toUpperCase());
        temp.text("Temp: " + data.current.temp + " ° F ");
        humidity.text("Humidity: " + data.current.humidity + " %");
        uv.text("UV Index: " + data.current.uvi);
        wind.text("Wind: " + data.current.wind_speed + " MPH");
        // append data that i recieved from api to page
        dateEl.append(date);
        cityEl.append(cityName);
        currentWeatherEl.append(temp);
        currentWeatherEl.append(humidity);
        currentWeatherEl.append(wind);
    //    setting conditions for the uvindex
        if(data.current.uvi <= 3) {
            uv.css("background-color", "#f1f15aa6");
        }
        else if (data.current.uvi >= 6) {
            uv.css("background-color", "rgba(216, 25, 25, 0.747)");
        }
        else {
            uv.css("background-color", "rgba(241, 122, 11, 0.829)");
        }
        // appending uvindex to page
        currentWeatherEl.append(uv);
       
               forecastEl.text('5 Day Forecast: ');
        
       var mydata = data.daily
       for(var i = 0; i < 5; i++) {
           console.log(mydata[i]);
           var myDiv = $('<div>');
           var forecastDate = $('<p>')
           var forecastTemp = $('<p>');
           var forecastHumidity = $('<p>');
           var imgEl = $('<img>')
           var unixDate = mydata[i].dt;
           var normalDate = moment.unix(unixDate).format("MM/DD/YY");
           var myicon = mydata[i].weather[0].icon
           var myIconUrl = " https://openweathermap.org/img/wn/" + myicon + "@2x.png";
           
           imgEl.attr('src', myIconUrl);
           forecastTemp.text("Temp: " + mydata[i].temp.day + "° F");
           forecastHumidity.text("Humidity: " + mydata[i].humidity + "%");
           myDiv.css('background-color', 'rgba(22, 79, 163, 0.966)').css('margin', '5px').css('border-radius', '5px');
           myDiv.addClass("col-12 col-lg-2");

           forecastDate.append(normalDate);
           myDiv.append(forecastDate);
           myDiv.append(forecastTemp);
           myDiv.append(forecastHumidity);
           myDiv.append(imgEl);

           forecastBox.append(myDiv);
       }
    })
})
        .catch(function(err) {
            console.error(err);          
})
}

var cityList = $('#recent-city');

function getInputs() {
    var lastCity = localStorage.getItem("recentcity");
    var cityBtn = $('<li>')

    cityBtn.attr('type', 'button').addClass('list-item');
    cityBtn.append(lastCity);
    cityList.append(cityBtn);

    var newCityInput = cityBtn.html();
    console.log(newCityInput);

    cityBtn.on('click', function() {
        inputEl.val(newCityInput);
        getCurrentWeather();
    })
}


$("#button-addon2").on('click',function() {
    getCurrentWeather();
    getInputs();
    inputEl.val("");

})
