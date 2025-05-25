const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('electronAPI',{
    fetchWeather: () => ipcRenderer.send('fetchWeather'),
    onWeatherResponse: (callback) => ipcRenderer.on('getWeatherResponse', (event, data) => callback(data)),
    minimize: () => ipcRenderer.send('windowMinimize'),
    close: () => ipcRenderer.send('windowClose'),
});