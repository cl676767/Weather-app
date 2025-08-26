
//let weatherData;

let now = new Date();
let index = Math.floor((60*now.getHours()+now.getMinutes()) / 15);

let description;

fetch("https://gist.githubusercontent.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c/raw/76b0cb0ef0bfd8a2ec988aa54e30ecd1b483495d/descriptions.json")
  .then(response => response.json())
  .then(data => {
    description = data;
  })
  .catch(error => {
    console.error("Error fetching descriptions:", error);
  });

async function fetchWeather(lat,lon){
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&minutely_15=temperature_2m,apparent_temperature,weather_code&daily=sunrise,sunset&timezone=America/New_York`)
  .then(response => {
    if (!response.ok) {
      throw new Error("Error fetching");
    }
    return response.json();
  })
  .then(data => {
    const weather = data.minutely_15;
    // Store only the four pieces of info as an object
    document.getElementById("temp").textContent = weather.temperature_2m[index];
    document.getElementById("app_temp").textContent = weather.apparent_temperature[index];
    console.log(description[weather.weather_code[index].toString()].description);
    if(weather.time[index]>data.daily.sunrise[0] && weather.time[index]<data.daily.sunset[0]){
      document.getElementById("description").textContent = description[weather.weather_code[index].toString()]["day"].description;
      document.getElementById("weather-icon").src = description[weather.weather_code[index].toString()]["day"].image;
    }
    else{
      document.getElementById("description").textContent = description[weather.weather_code[index].toString()]["night"].description;
      document.getElementById("weather-icon").src = description[weather.weather_code[index].toString()]["night"].image;
    }

    /* weatherData = {
      temp: weather.temperature_2m[index],
      app_temp: weather.apparent_temperature[index],
      description: weather.weather_code[index],
      time: weather.time[index]
    }; 
    // Log after data is stored
    console.log(weatherData); */

  })
  .catch(error => {
    console.error("Error fetching weather data:", error);
  });

}


 document.getElementById("search-button").onclick = function() {
    const cityName = document.getElementById("search-input").value;
    const url = `https://nominatim.openstreetmap.org/search?q=${cityName}&format=json`;
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error("Error fetching coordinates");
        }
        return response.json();
      })
      .then(data => {
        if (data.length > 0) {
          const { lat, lon } = data[0];
          // You can now use these coordinates to fetch weather data
          fetchWeather(parseFloat(lat), parseFloat(lon));
          document.getElementById("label").textContent = cityName.charAt(0).toUpperCase() + cityName.slice(1);
        } else {
          console.log("No results found");
        }
      })
      .catch(error => {
        console.error("Error fetching coordinates:", error);
      });
  };
