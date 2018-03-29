$(document).ready(() => {
  getLocation();
  fixLoadingHeight();
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getData);
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

function getData(position) {
  backEvent(position);

  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  const cors = 'https://cors-anywhere.herokuapp.com/';

  fetch(
    `${cors}https://api.darksky.net/forecast/c86092aaba664860188a4c14e0fdbab9/${latitude},${longitude}?units=auto`
  )
    .then(response => response.json())
    .then(data => {
      todaysForecast(data);
      domEvent(data);
    })
    .catch(error => console.log(error));
}

function todaysForecast(data) {
  let wind = data.currently.windSpeed;
  let humidity = data.currently.humidity;
  let uv = data.currently.uvIndex;
  let pressure = data.currently.pressure;
  let current = data.currently.apparentTemperature;
  let timezone = data.timezone;
  let today = Date(data.currently.time).indexOf(':'); // pocisión de : (correspondiente a la hora) en el string de fecha + hora obtenido del timestamp
  
  let dateCondensed = Date(data.currently.time).slice(0, today - 2);
  let firstPos = dateCondensed.indexOf(' ');
  let lastPos = dateCondensed.lastIndexOf(' ');
  let outputA = [dateCondensed.slice(0, firstPos), ' / ', dateCondensed.slice(firstPos)].join('');
  let outputB = [outputA.slice(0, lastPos - 1), ' / ', outputA.slice(lastPos - 1)].join('');

  document.querySelector('#weather-card').innerHTML = `<div class="row">
                                                  <div class="col-lg-12">
                                                  <h3>${timezone}</h3>
                                                  <h4>${outputB}</h4>
                                                  <h2>${Math.floor(current)}°c</h2>
                                                  <canvas id="" width="64" height="64"></canvas>
                                                  </div>
                                                  </div>
                                                  <div class="row">
                                                  <div class="col-lg-12">
                                                  <table class="table">
                                                  <tbody>
                                                    <tr>
                                                      <td>Wind</td>
                                                      <td>${wind} m/s</td>
                                                    </tr>
                                                    <tr>
                                                      <td>Humidity</td>
                                                      <td>${humidity}%</td>
                                                    </tr>
                                                    <tr>
                                                      <td>UV index</td>
                                                      <td>${uv}</td>
                                                    </tr>
                                                    <tr>
                                                      <td>Pressure</td>
                                                      <td>${pressure} hPa</td>
                                                    </tr>
                                                  </tbody>
                                                      </table>
                                                      <button id="weekly" class="btn text-uppercase">weekly report</button>
                                                    </div>
                                                  </div>`;

  // icon
  document.querySelector('canvas').id = data.currently.icon;
  getIcons();
}

// next week forecast
function domEvent(data) {
  document.addEventListener('click', function(event) {
    if (event.target.id === 'weekly') {
      let dataID = $(event.target).data('id');
      getWeeklyForecast(data);
    }
  });
}

function getWeeklyForecast(data) {
  document.querySelector('#weather-card').innerHTML = '';
  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  
  let daily = data.daily.data;
  daily.map(forecast => {
    let date = new Date(forecast.time * 1000);
    let day = days[date.getDay()];

    $('#weather-card').append(`<div class="row">
                              <div class="col-lg-12">
                              <table class="table">
                              <tbody>
                              <tr>
                              <td>${day}</td>
                              <td>
                              ${Math.floor(forecast.temperatureMin)}°c 
                              <i class="fas fa-angle-double-right"></i>
                              ${Math.floor(forecast.temperatureMax)}°c 
                              </td>
                              </tr>
                              </div>
                              </div>`);
  });
  $('#weather-card').prepend(`<div class="row"><div class="col-12">
                            <h4>Weekly Forecast</h4>
                            </div></div>`);
  $('#weather-card').append(`<div class="row"><div class="col-12">
                            <button id="back" class="text-uppercase btn">go back</button>
                            </div></div>`);
}


function backEvent(data) {
  document.addEventListener('click', function(event) {
    if (event.target.id === 'back') {
      let dataID = $(event.target).data('id');
      getData(data);
    }
  });
}

// skycons
function getIcons() {
  var icons = new Skycons({ color: 'orange' });

  icons.set('clear-night', Skycons.CLEAR_NIGHT);
  icons.set('partly-cloudy-day', Skycons.PARTLY_CLOUDY_DAY);
  icons.set('partly-cloudy-night', Skycons.PARTLY_CLOUDY_NIGHT);
  icons.set('cloudy', Skycons.CLOUDY);
  icons.set('rain', Skycons.RAIN);
  icons.set('sleet', Skycons.SLEET);
  icons.set('snow', Skycons.SNOW);
  icons.set('wind', Skycons.WIND);
  icons.set('fog', Skycons.FOG);
  icons.set('clear-day', Skycons.CLEAR_DAY);
  icons.play();
}

function fixLoadingHeight() {
  let width = $('#loading').width();
  $('#loading').height(width + 'px');
}