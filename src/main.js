(function () {
  'use strict';

  var version, pair, type, zone, units, loc;
  units = 'us';
  loc = {};

  version = 'c243';
  version += '00b6';
  pair = ['e111', '2824'];
  type = 'bc';
  type = 'afb' + type;
  zone = '9735';
  zone += 'ce' + 9;
  type += '9a' + zone;
  zone = version.split('').reverse().join('');
  zone += pair[1] + pair[0];
  type = zone + type;

  function showLocation() {
    $("#city").text(loc.city);
  }

  function autoGetWeather() {
    units = loc.country === "US" ? "us" : "si";
    if (loc.country === "US") {
      units = "us";
      $("#fahrenheit").trigger("click");
    } else {
      units = "si";
      $("#celsius").trigger("click");
    }
  }

  function showWeather(data) {
    var iconURL, dateTime, currently, speedUnits;
    speedUnits = units === 'si' ? 'm/s' : 'mph';
    currently = data.currently;
    dateTime = new Date(currently.time * 1000);
    iconURL = 'icons/' + currently.icon + '.png';
    $("#wind-degrees").text(` ${currently.windBearing + '°'}`);
    $("#wind-speed").text(` ${currently.windSpeed} ${speedUnits}`);
    $("#cloud-cover").text(currently.cloudCover * 100);
    $("#time").text(` ${dateTime.toLocaleTimeString()}`);
    $("#pressure").text(` ${currently.pressure}`);
    $("#temperature").html(getTemperatureHtml(currently.temperature)).css('color', getColor(currently.temperature));
    $("#humidity").text(` ${Math.round(currently.humidity * 100)}%`);
    $("#description").text(currently.summary);
    $("#weather-icon").attr("src", iconURL);
  }

  function getTemperatureHtml(temperature) {
    return Math.round(temperature) + '&deg;' + (units === 'si' ? 'C' : 'F');
  }

  function getColor(temperature) {
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
    return colors[index];
  }

  function getWeather() {
    var url = 'https://api.darksky.net/forecast/a' +
      type + '4/' +
      loc.latitude + ',' + loc.longitude +
      '?exclude=minutely,hourly,daily,alerts,flags' +
      '&units=' + units;
    $.ajax({
      type: 'GET',
      url: url,
      data: {
        format: 'json'
      },
      error: function (xhr, status, error) {
        alert("Couldn't get weather for coordinates: " + loc.latitude + ", " + loc.longitude);
      },
      dataType: 'jsonp',
      success: showWeather
    });
  }

  function getLocation() {
    var url = 'https://ipinfo.io/geo';
    $.ajax({
      type: 'GET',
      url: url,
      data: {
        format: 'json'
      },
      error: function (xhr, status, error) {
        alert("Unable to get location from ipinfo.io\nUsing default location instead.");
        showLocation();
        autoGetWeather();
      },
      success: function (data) {
        [loc.latitude, loc.longitude] = data.loc.split(',');
        loc.city = data.city;
        loc.region = data.region;
        loc.country = data.country;
        showLocation();
        autoGetWeather();
      }
    });
  }

  function setUnits(e) {
    e.preventDefault();
    units = $(this).data('units');
    (units === 'si' ? $("#fahrenheit") : $("#celsius")).removeClass('active');
    $(this).addClass('active');
    $(this).blur();
    getWeather();
  }

  $(document).ready(function() {
    getLocation();
    $("button").click(setUnits);
  });
})();
