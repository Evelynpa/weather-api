(function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
})();

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  fetch(
    `https://api.darksky.net/forecast/c86092aaba664860188a4c14e0fdbab9/${latitude},${longitude}?units=auto`, {mode: 'no-cors'}
  )
    .then(response => response.json())
    .then(data => {
      let wind = data.currently.windSpeed;
      let humidity = data.currently.humidity;
      let uv = data.currently.uvIndex;
      let pressure = data.currently.pressure;
      let current = data.currently.apparentTemperature;
      let timezone = data.timezone;
      let today = Date(data.currently.time).indexOf(":"); // pocisión de : (correspondiente a la hora) en el string de fecha + hora obtenido del timestamp

      document.querySelector("#weather-card").innerHTML = `<div class="row">
                                                      <div class="col-lg-12">
                                                      <h3>${timezone}</h3>
                                                      <h4>${Date(data.currently.time).slice(0, today - 2)}</h4>
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
                                                          <button id="weekly" class="btn btn-warning text-uppercase">weekly report</button>
                                                        </div>
                                                      </div>`;

      // icons
      document.querySelector("canvas").id = data.currently.icon;
      getIcons();

      // next week forecast
      document.querySelector("#weekly").addEventListener("click", function() {
        document.querySelector("#weather-card").innerHTML = "";
        let days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ];

        let daily = data.daily.data;
        for (let i in daily) {
          let date = new Date(daily[i].time * 1000);
          let day = days[date.getDay()];

          $('#weather-card').append(`<div class="row">
                                    <div class="col-lg-12">
                                    <table class="table">
                                    <tbody>
                                    <tr>
                                    <td><canvas id="${daily[i].icon}" width="30" height="30"></canvas> ${day}</td>
                                    <td><i class="glyphicon glyphicon-arrow-down"></i> 
                                    ${Math.floor(daily[i].temperatureMin)}°c 
                                    <i class="glyphicon glyphicon-minus"></i> 
                                    ${Math.floor(daily[i].temperatureMax)}°c 
                                    <i class="glyphicon glyphicon-arrow-up"></i></td>
                                    </tr>
                                    </div>
                                    </div>`);
          getIcons()
        }
      });
    })
    .catch(error => alert("Error de conexión"));
}

// skycons
function getIcons() {
  var icons = new Skycons({ color: "orange" });

  icons.set("clear-night", Skycons.CLEAR_NIGHT);
  icons.set("partly-cloudy-day", Skycons.PARTLY_CLOUDY_DAY);
  icons.set("partly-cloudy-night", Skycons.PARTLY_CLOUDY_NIGHT);
  icons.set("cloudy", Skycons.CLOUDY);
  icons.set("rain", Skycons.RAIN);
  icons.set("sleet", Skycons.SLEET);
  icons.set("snow", Skycons.SNOW);
  icons.set("wind", Skycons.WIND);
  icons.set("fog", Skycons.FOG);
  icons.set("clear-day", Skycons.CLEAR_DAY);
  icons.play();
}