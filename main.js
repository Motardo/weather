(function() {
  "use strict";

  var latitude, longitude, units = 'imperial';

  var showLocation = function(city, region, country) {
    $("#city").text(city);
    $("#region").text(region);
    $("#country").text(country);
  };

  var showWeather = function(data) {
    var iconURL;
    $("#wind-degrees").text(data.wind.deg);
    $("#wind-speed").text(data.wind.speed);
    $("#speed-units").text(units === 'metric' ? 'm/s' : 'mph');
    $("#cloud-cover").text(data.clouds.all);
    $("#name").text(data.name);
    $("#date-time").text(new Date(data.dt * 1000).toLocaleString());
    $("#pressure").text(data.main.pressure);
    $("#temperature").text(data.main.temp);
    $("#temperature-units").text(units === 'metric' ? 'C' : 'F');
    $("#humidity").text(Math.round(data.main.humidity));
    $("#conditions").text(data.weather[0].main);
    $("#description").text(data.weather[0].description);
    iconURL = 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
    $("#weather-icon").attr("src", iconURL);
  };

  var getWeather = function() {
    var url = 'http://api.openweathermap.org/data/2.5/weather?' +
      'lat=' + latitude + '&lon=' + longitude +
      '&appid=a2f1d037f13b14dc44c5d1c0d6bd5d50' +
      '&units=' + units;
    $.ajax({
      type: 'GET',
      url: url,
      data: {
        format: 'json'
      },
      error: function(xhr, status, error) {
        alert("Aw snap, couldn't get weather for " + latitude + ", " + longitude);
      },
      dataType: 'jsonp',
      success: showWeather
    });
  };

  var setUnits = function(e) {
    e.preventDefault();
    units = $(this).data('units');
    (units === 'metric' ? $("#fahrenheit") : $("#celsius")).removeClass('active');
    $(this).addClass('active');
    getWeather();
  };

  $(document).ready(function() {
    $.get("http://ipinfo.io/geo", function(response) {
      [latitude, longitude] = response.loc.split(',');
      showLocation(response.city, response.region, response.country);
      getWeather();
    }, "jsonp");

    $("button").click(setUnits);
  });
}());
