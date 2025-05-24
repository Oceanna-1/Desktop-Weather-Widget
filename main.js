const { app, BrowserWindow, ipcMain } = require('electron');
const axios = require('axios');
const path = require('path');

/**
 * Makes call to WebAPI to retrieve the current weather in Hamilton, Ontario
 */
function generateWeather(){
    ipcMain.on('fetchWeather', async (event) => {
      try {
         const response = await axios.get('https://api.open-meteo.com/v1/forecast?latitude=43.25&longitude=-79.87&models=gem_seamless&current=temperature_2m,is_day,weather_code');
         event.reply('getWeatherResponse', response.data);
      } catch (error) {
         console.error(error);
      }
   });
}

function setSky(){
  ipcMain.handle('getCurrentTime', () => {
    return (new Date).getHours();
  });
}

/**
 * Creates window for application
 */
function createWindow () {
  const win = new BrowserWindow({
    width: 350,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    frame: false,
    titleBarStyle: 'hidden',
    maximizable: false,
    resizable: false
  })
  win.loadFile('index.html');
  generateWeather();
  setSky();
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

