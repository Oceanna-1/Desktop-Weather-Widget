const { app, BrowserWindow, ipcMain } = require('electron');
const axios = require('axios');

/**
 * Makes call to WebAPI to retrieve the current weather in Hamilton, Ontario
 */
function generateWeather(){
    ipcMain.on('fetchWeather', async (event, args) => {
      try {
         const response = await axios.get('https://api.open-meteo.com/v1/forecast?latitude=43.25&longitude=-79.87&models=gem_seamless&current=temperature_2m,is_day,weather_code');
         event.reply('getWeatherResponse', response.data);
      } catch (error) {
         console.error(error);
      }
   });
}

/**
 * Quantifies time of day as day, night or dusk / dawn for displaying background
 * @returns integer of 1,2,3 representating daytime, nightime and dusk/dawn for displaying the correct background 
 */
function timeOfDay(){
    let hour = (new Date).getHours();
    console.log("Current Hour is: " + hour)
    let timeOfDay;
    console.log(hour >= 7 && hour < 19? "true": "false")
        // day time - 7am up to (not including) 7pm
        if (hour >= 7 && hour < 19){
          timeOfDay = 1;
          console.log("Daytime")
        }
        // night time - 9pm up to (not including) 5am
        else if (hour >= 21 && hour < 5){
          timeOfDay = 2;
          console.log("Nighttime")
        }
        // catches dusk and dawn - 5am to 6:59am and 7pm to 8:59pm
        else{
          timeOfDay = 3;
          console.log("Dusk or Dawn")
        }
    return timeOfDay;
}

/**
 * Creates window for application
 */
function createWindow () {
  const win = new BrowserWindow({
    width: 350,
    height: 425,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    frame: false,
    titleBarStyle: 'hidden',
    maximizable: false,
    resizable: false
    /*
    titleBarOverlay: {
      color: '#2f3241',
      symbolColor: '#74b1be',
      height: 0
    },
    
    */
  })

  win.webContents.openDevTools();
  win.loadFile('index.html');
  generateWeather();
  console.log(timeOfDay());
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

