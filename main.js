"use strict";

  var units = 'us';
  var loc = {
    'latitude': 35.8,
    'longitude': -78.8,
    'city': 'Elm City',
    'country': 'US',
    'region': 'North Carolina'
  };

  var showLocation = function() {
    $("#city").text(loc.city);
    $("#region").text(loc.region);
    $("#country").text(loc.country);
  };

  var autoGetWeather = function () {
    units = loc.country === "US"? "us": "si";
    if (loc.country === "US") {
      units = "us";
      $("#fahrenheit").trigger("click");
    } else {
      units = "si";
      $("#celsius").trigger("click");
    }
  };

  var showWeather = function(data) {
    var iconURL, dateTime, currently = data.currently;
    console.log(data);
    $("#winddegrees").text(currently.windBearing + '°');
    $("#wind-speed").text(currently.windSpeed);
    $("#speed-units").text(units === 'si' ? 'm/s' : 'mph');
    $("#cloud-cover").text(currently.cloudCover * 100);
    $("#name").text(currently.name);
    dateTime = new Date(currently.time * 1000);
    $("#date").text(dateTime.toLocaleDateString());
    $("#time").text(dateTime.toLocaleTimeString());
    $("#pressure").text(currently.pressure);
    $("#temperature").html(getTemperatureHtml(currently.temperature)).css('color', getColor(currently.temperature));
    $("#humidity").text(Math.round(currently.humidity * 100));
    //$("#conditions").text(currently.precipProbability * 100);
    $("#description").text(currently.summary);
    iconURL = 'icons/' + currently.icon + '.png';
    $("#weather-icon").attr("src", iconURL);
  };

  var getTemperatureHtml = function(temperature) {
    return temperature + '&deg;' + (units === 'si' ? 'C' : 'F');
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
    if (units === 'si') {
      temperature = temperature * 9 / 5.0 + 32;
    }
    index = Math.round(temperature / 5.0 - 7);
    index = index < 0 ? 0 : index >= colors.length ? colors.length - 1 : index;
    //$("body").css('backgroundColor', '#a6f');
    return colors[index];
  };

  var getWeather = function() {
    var url = 'https://api.darksky.net/forecast/a6b00342c2824e111afbbc9a9735ce94/' +
      loc.latitude + ',' + loc.longitude +
      '?exclude=minutely,hourly,daily,alerts,flags' +
      '&units=' + units;
    $.ajax({
      type: 'GET',
      url: url,
      data: {
        format: 'json'
      },
      error: function(xhr, status, error) {
        alert("Aw snap, couldn't get weather for " + loc.latitude + ", " + loc.longitude);
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
        alert("Unable to get location from ipinfo.io\nUsing default location instead.");
        showLocation();
        autoGetWeather();
      },
      success: function(data) {
        [loc.latitude, loc.longitude] = data.loc.split(',');
        loc.city = data.city;
        loc.region = data.region;
        loc.country = data.country;
        console.log(data);
        showLocation();
        autoGetWeather();
      }
    });
  };

  var setUnits = function(e) {
    e.preventDefault();
    units = $(this).data('units');
    (units === 'si' ? $("#fahrenheit") : $("#celsius")).removeClass('active');
    $(this).addClass('active');
    $(this).blur();
    getWeather();
  };

  $(document).ready(function() {
//    $.getJSON("https://ipinfo.io/geo", function(response) {
//      [latitude, longitude] = response.loc.split(',');
//      showLocation(response.city, response.region, response.country);
//     // getWeather();
//    });
    getLocation();
    $("button").click(setUnits);
  });
