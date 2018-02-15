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


    fetch(`https://api.darksky.net/forecast/c86092aaba664860188a4c14e0fdbab9/${latitude},${longitude}?units=auto`).then(response => response.json())
        .then(data => {
            console.log(data);
            let wind = data.currently.windSpeed;
            let humidity = data.currently.humidity;
            let uv = data.currently.uvIndex;
            let pressure = data.currently.pressure;

            windResult.innerHTML = wind;
            humidityResult.innerHTML = humidity;
            uvResult.innerHTML = uv;
            pressureResult.innerHTML = pressure;

            let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            let daily = data.daily.data;
            console.log(daily);
            for (let i in daily) {
                let date = new Date(daily[i].time * 1000);
                let day = days[date.getDay()];
                $('body').append(`<p>${day}, ${daily[i].temperatureMax}° - ${daily[i].temperatureMin}°</p>`)
            }

        })
        .catch(error => console.log('Error de conexión'));

}





