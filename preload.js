const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('electronTime',{
    fetchWeather: () => ipcRenderer.send('fetchWeather'),
    onWeatherResponse: (callback) => ipcRenderer.on('getWeatherResponse', (event, data) => callback(data)),
    getCurrentHour: () => ipcRenderer.invoke('getCurrentTime')
});