const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('focusboardDesktop', {
  notify: (taskTitle) =>
    ipcRenderer.invoke('focusboard:notify', taskTitle),
})