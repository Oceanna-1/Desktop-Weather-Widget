// select dom elements to display weather
const temperature = document.getElementById('temp-now');
const weather = document.getElementById('weather-now');
const currentSky = document.getElementById("pixel-scene");

window.electronTime.onWeatherResponse((data) => {
  temperature.innerHTML = data.current.temperature_2m + data.current_units.temperature_2m;
  weather.innerHTML = interpretWMO(data.current.weather_code);
});
window.electronTime.fetchWeather();


/**
 * Qualifies time of day as day, night or dusk / dawn to be used as the class name for the element background
 * @returns string representing time of day
 */

async function setTimeOfDay(){
    const hour = await window.electronTime.getCurrentHour();
    console.log("Current Hour is: " + hour)
    
    // day time - 7am up to (not including) 7pm
    if (hour >= 7 && hour < 19){
        currentSky.className = "art-display daytime";
        console.log("Daytime")
    }
    // night time - 9pm up to (not including) 5am
    else if (hour >= 21 || hour < 5){
        currentSky.className = "art-display nightime";
        console.log("Nighttime")
    }
    // catches dusk and dawn - 5am to 6:59am and 7pm to 8:59pm
    else{
        currentSky.className = "art-display dusk";
        console.log("Dusk or Dawn")
    }
}
setTimeOfDay();

/**
 * Interprets WMOCode as weather condition string
 * @param {*} WMOCode 
 * @returns string representation of current weather based on WMOCode
 */
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