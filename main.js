(function() {
  "use strict";

  var latitude, longitude, units = 'imperial';

  var showLocation = function(city, region, country) {
    $("#city").text(city);
    $("#region").text(region);
    $("#country").text(country);
  };

  var showWeather = function(data) {
    var iconURL, dateTime;
    console.log(data);
    $("#wind-degrees").text(data.wind.deg + '°');
    $("#wind-speed").text(data.wind.speed);
    $("#speed-units").text(units === 'metric' ? 'm/s' : 'mph');
    $("#cloud-cover").text(data.clouds.all);
    $("#name").text(data.name);
    dateTime = new Date(data.dt * 1000);
    $("#date").text(dateTime.toLocaleDateString());
    $("#time").text(dateTime.toLocaleTimeString());
    $("#pressure").text(data.main.pressure);
    $("#temperature").html(getTemperatureHtml(data.main.temp)).css('color', getColor(data.main.temp));
    $("#humidity").text(Math.round(data.main.humidity));
    $("#conditions").text(data.weather[0].main);
    $("#description").text(data.weather[0].description);
    iconURL = 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
    $("#weather-icon").attr("src", iconURL);
  };

  var getTemperatureHtml = function(temperature) {
    return temperature + '&deg;' + (units === 'metric' ? 'C' : 'F');
  };

  var getColor = function(temperature) {
    var index, colors;
    colors = [
      '#0ef',
      '#a0f',
      '#60f',
      '#4af',
      '#0f6',
      '#0b0',
      '#6f0',
      '#bd0',
      '#fc0',
      '#f80',
      '#f60',
      '#f00'
    ]

    if (units === 'metric') {
      temperature = temperature * 9 / 5.0 + 32;
    }
    index = Math.round(temperature / 5.0 - 7);
    index = index < 0 ? 0 : index >= colors.length ? colors.length - 1 : index;
    //$("body").css('backgroundColor', '#a6f');
    return colors[index];
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

  var getLocation = function() {
    var url = 'https://ipinfo.io/geo';
    $.ajax({
      type: 'GET',
      url: url,
      data: {
        format: 'json'
      },
      error: function(xhr, status, error) {
        alert("Aw snap, couldn't get location");
        console.log(xhr);
        console.log(status);
        console.log(error);
      },
      dataType: 'jsonp',
      success: function(data) {
        [latitude, longitude] = data.loc.split(',');
        console.log(latitude);
        console.log(longitude);
      }
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
    $.getJSON("https://ipinfo.io/geo", function(response) {
      [latitude, longitude] = response.loc.split(',');
      showLocation(response.city, response.region, response.country);
     // getWeather();
    });
    //getLocation();
    $("button").click(setUnits);
  });
}());
