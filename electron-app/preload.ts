/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
const { contextBridge, ipcRenderer } = require('electron');

// Create a safe API object to expose to the renderer process
const electronAPI = {
  ipcRenderer: {
    send: (channel: string, data: any) => {
      ipcRenderer.send(channel, data);
    },
    on: (channel: string, func: (...args: any[]) => void) => {
      ipcRenderer.on(channel, (_: any, ...args: any[]) => func(...args));
    },
    once: (channel: string, func: (...args: any[]) => void) => {
      ipcRenderer.once(channel, (_: any, ...args: any[]) => func(...args));
    },
    removeListener: (channel: string, func: (...args: any[]) => void) => {
      ipcRenderer.removeListener(channel, func);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronAPI);

// Listen for messages from the main process
ipcRenderer.on('main-process-message', (_event: any, message: any) => {
  console.log('[Receive Main-process message]:', message);
});

console.log('Preload script loaded!');
