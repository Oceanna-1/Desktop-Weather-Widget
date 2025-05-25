// select dom elements to display weather
const temperature = document.getElementById('temp-now');
const weather = document.getElementById('weather-now');
const currentSky = document.getElementById("pixel-scene");
const currentDate = document.getElementById("currentDate");
const currentSeason = document.getElementById("currentSeason");
const seasonIcon = document.getElementById("seasonIcon");
const cat = document.getElementById("cat");
const trees = document.getElementById("seasonalTrees");

// not current using react - need to save time / season at load to prevent unnecessary renders
let prevHour = new Date().getHours();
let prevDay = new Date().toDateString();
let prevMinute = new Date().getMinutes();
let prevSeason = getCurrentSeason(new Date());



/**
 * Qualifies time of day as day, night or dusk / dawn to be used as the class name for the element background
 * @returns string representing time of day
 */

function setTimeOfDay(){
    const hour = new Date().getHours();
    const displayHour = hour % 12;
    console.log("Current Hour is: " + (displayHour == 0 ? 12 : displayHour))
    // day time - 7am up to (not including) 7pm
    if (hour >= 7 && hour < 19){
        currentSky.className = "art-display daytime";
    }
    // night time - 9pm up to (not including) 5am
    else if (hour >= 21 || hour < 5){
        currentSky.className = "art-display nightime";
    }
    // catches dusk and dawn - 5am to 6:59am and 7pm to 8:59pm
    else{
        currentSky.className = "art-display dusk";
    }
}


/**
 * Reformats the current date into an easily readable string containing the current season
 * @param {Date} date Current date (unformatted)
 * Returns a formatted string of the current date
 */
function formatDate(date){
    const formatter = Intl.DateTimeFormat('en-CA', {
        year:'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: '2-digit',
        hourCycle: 'h12'
    })
    return formatter.format(new Date());
}

/**
 * Based on current date, determines the season (based on early estimates of solstice/equinox dates)
 * @param {Date} date Current date (unformatted)
 * Returns current season as a string (Spring, Summer, Autumn, Winter)
 */
function getCurrentSeason(date){
    // get individual date elements from passed in date to reformat into ymd for comparison
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1;
    const currentDay = date.getDate();
    const ymdDate = new Date(currentYear + "=" + currentMonth + "-" + currentDay);

    // equinox / solstice dates (greedy - based on the early estimated start dates as these change annually based on earths position) 
    const springEquinox = new Date(currentYear + "-03-20");
    const summerSolstice = new Date(currentYear + "-06-20");
    const autumnEquinox = new Date(currentYear + "-09-20");
    const winterSolstice = new Date(currentYear + "-12-20");
    
    if (ymdDate >= springEquinox && ymdDate < summerSolstice){
        return "Spring";
    }
    else if(ymdDate >= summerSolstice && ymdDate < autumnEquinox){
        return "Summer"
    }
    else if(ymdDate >= autumnEquinox && ymdDate < winterSolstice){
        return "Autumn";
    }
    else{
        return "Winter";
    }
}

/**
 * Sets the elements of the widget related to season based elements (cat appearance, background trees, season title, icon)
 */
function setSeasonalElements(){
    const date = new Date(); 
    const season = getCurrentSeason(date);
    currentSeason.innerHTML = season;
    seasonIcon.src = "assets/icons/" + season + "_icon.png";
    seasonIcon.alt = season + " icon";
    cat.src = "assets/cat/orange_cat_" + season + ".png";
    trees.src = "assets/season/" + season + "_trees.png";
}


/**
 * Sets the elements of the widget related to time based aspects (day color, day string)
 */
function setTimeElements(){
    const date = new Date();
    currentDate.innerHTML = formatDate(date);
}

/**
 * Interprets WMOCode returned from API call as weather condition string
 * @param {*} WMOCode 
 * @returns string representation of current weather based on WMOCode
 */
function interpretWMO(WMOCode){
    let weather = "";

    if(WMOCode == 0){weather = "Clear Skies"}
    else if(WMOCode == 1){weather =  "Mainly Clear"}
    else if(WMOCode == 2){weather =  "Partly Cloudy"}
    else if(WMOCode == 3){weather =  "Overcast"}
    else if(WMOCode >= 45 && WMOCode <= 48){weather =  "Foggy"}
    else if(WMOCode == 51){weather =  "Light Drizzle"}
    else if(WMOCode == 53){weather =  "Moderate Drizzle"}
    else if(WMOCode == 55){weather =  "Heavy Drizzle"}
    else if(WMOCode == 56 || WMOCode == 57){weather =  "Freezing Drizzle"}
    else if(WMOCode == 61){weather =  "Lightly Raining"}
    else if(WMOCode == 63){weather =  "Moderately Raining"}
    else if(WMOCode == 65){weather =  "Heavily Raining"}
    else if(WMOCode == 66 || WMOCode == 67){weather =  "Freezing Rain"}
    else if(WMOCode == 71){weather =  "Lightly Snowing"}
    else if(WMOCode == 73){weather =  "Moderately Snowing"}
    else if(WMOCode == 75){weather =  "Heavily Snowing"}
    else if(WMOCode == 77){weather =  "Snowing"}
    else if(WMOCode == 80){weather =  "Light Rain Showers"}
    else if(WMOCode == 81){weather =  "Moderate Rain Showers"}
    else if(WMOCode == 82){weather =  "Violent Rain Showers"}
    else if(WMOCode == 85){weather =  "Light Snow Showers"}
    else if(WMOCode == 86){weather =  "Heavy Snow Showers"}
    else if(WMOCode == 95){weather =  "Thunderstorms"}
    else {weather =  "Could not access weather reports"}

    return weather;
}

window.electronAPI.onWeatherResponse((data) => {
  temperature.innerHTML = data.current.temperature_2m + data.current_units.temperature_2m;
  weather.innerHTML = interpretWMO(data.current.weather_code);
});

window.electronAPI.fetchWeather();
document.getElementById('minimize-btn').addEventListener('click', () => {
    window.electronAPI.minimize();
});
document.getElementById('close-btn').addEventListener('click', () => {
    window.electronAPI.close();
});

setTimeOfDay();
setSeasonalElements();
setTimeElements()

setInterval(()=>{
    let newDate = new Date();
    let currentMinute = newDate.getMinutes();
    let currentHour = newDate.getHours();
    let currentDay = newDate.getDay();

    if(currentMinute == 1 || currentMinute == 16 || currentMinute == 31 || currentMinute == 46){
       window.electronAPI.onWeatherResponse((data) => {
            temperature.innerHTML = data.current.temperature_2m + data.current_units.temperature_2m;
            weather.innerHTML = interpretWMO(data.current.weather_code);
        }); 
    }

    if(currentHour != prevHour){
        setTimeOfDay();
    }

    if(currentDay != prevDay){
        setSeasonalElements();
    }

    setTimeElements();

}, 60000)
