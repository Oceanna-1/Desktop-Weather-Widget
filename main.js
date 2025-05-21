const { app, BrowserWindow, ipcMain } = require('electron');
const axios = require('axios');

const path = require('node:path')


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

function timeOfDay(){
    let hour = (new Date).getHours();
    let timeOfDay = 0;
    switch (hour){
        case (hour >= 4 && hour < 7):
            timeOfDay = 1;
            break;
        case (hour >= 7 && hour < 7 && hour < 12):
            timeOfDay = 2;
            break;
        case (hour >=12 && hour < 16):
            timeOfDay = 3;
            break;
        case (hour >=16 && hour < 20):
            timeOfDay = 4;
            break;
        default:
            timeOfDay = 5;
            break;
    }
    return timeOfDay;
}
function createWindow () {
  const win = new BrowserWindow({
    width: 300,
    height: 450,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: {
        color: '#2f3241',
        symbolColor: '#74b1be',
        height: 30
    },
    maximizable: false,
    resizable: false
  })

  win.webContents.openDevTools();
  win.loadFile('index.html')
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

