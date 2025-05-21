const { ipcRenderer } = require('electron');

// select dom elements to display weather
const temperature = document.getElementById('temp-now');
const weather = document.getElementById('weather-now');

// will call axios function to retrieve data
ipcRenderer.on('getWeatherResponse', (event, data) => {
    const response = data;
    temperature.innerHTML = response.current.temperature_2m + response.current_units.temperature_2m;
    weather.innerHTML = interpretWMO(response.current.weather_code);
});

//sends from the fetchWeather channel
ipcRenderer.send('fetchWeather'); 


function interpretWMO(WMOCode){
    let weather = "";
    switch(WMOCode) {
        case 0:
            weather = "Clear Sky"
            break;
        case 1:
            weather =  "Mainly Clear"
            break;
        case 2:
            weather =  "Partly Cloudy"
            break;
        case 3:
            weather =  "Overcast"
            break; 
        case 45:
            weather =  "Foggy"
            break;
        case 48:
            weather =  "Foggy"
            break; 
        case 51:
            weather =  "Light Drizzle"
            break;
        case 53:
            weather =  "Moderate Drizzle"
            break;
        case 55:
            weather =  "Heavy Drizzle"
            break;
        case 56:
            weather =  "Freezing Drizzle"
            break;
        case 57:
            weather =  "Freezing Drizzle"
            break;
        case 61:
            weather =  "Lightly Raining"
            break;
        case 63:
            weather =  "Moderately Raining"
            break;
        case 65:
            weather =  "Heavily Raining"
            break;
        case 66:
            weather =  "Freezing Raining"
            break;
        case 67:
            weather =  "Freezing Raining"
            break;
        case 71:
            weather =  "Lightly Snowing"
            break;
        case 71:
            weather =  "Moderately Snowing"
            break;
        case 71:
            weather =  "Heavily Snowing"
            break;
        case 77:
            weather =  "Snowing"
            break;
        case 80:
            weather =  "Light Rain Showers"
            break;
        case 81:
            weather =  "Moderate Rain Showers"
            break;
        case 82:
            weather =  "Violent Rain Showers"
            break;
        case 85:
            weather =  "Light Snow Showers"
            break;
        case 86:
            weather =  "Heavy Rain Showers"
            break;
        case 95: 
            weather =  "Thunderstorms"
            break;
        default:
            break;
    }
    return weather;
}