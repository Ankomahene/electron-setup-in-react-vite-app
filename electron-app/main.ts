/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

// Define paths for different build environments
const DIST_PATH = app.isPackaged
  ? path.join(__dirname, '../dist')
  : path.join(__dirname, '../../dist');

const PUBLIC_PATH = app.isPackaged
  ? path.join((process as any).resourcesPath, 'app', 'public')
  : path.join(__dirname, '../../public');

// Set environment variables for use throughout the app
process.env.DIST = DIST_PATH;
process.env.PUBLIC = PUBLIC_PATH;
process.env.VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL || '';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

let win: any = null;
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

function createWindow() {
  // Determine icon path based on platform
  const iconPath = path.join(
    app.isPackaged ? PUBLIC_PATH : path.join(__dirname, '../../public'),
    process.platform === 'win32' ? 'favicon.ico' : 'icon.png'
  );

  // Create the browser window
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      devTools: !app.isPackaged,
    },
  });

  // Hide menu bar for cleaner look
  win.setMenuBarVisibility(false);
  win.setMenu(null);

  // Open DevTools in detached mode for debuggin
  //   win?.webContents.openDevTools({ mode: 'detach' });

  // Load the app
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    try {
      const indexPath = path.join(DIST_PATH, '../../dist/index.html');
      console.log('Loading index.html from:', indexPath);

      if (fs.existsSync(indexPath)) {
        win.loadFile(indexPath);
      } else {
        console.error('index.html not found at:', indexPath);
        // Could load an error page here
      }
    } catch (error) {
      console.error('Error loading index.html:', error);
    }
  }
}

// App event handlers
app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(() => {
  createWindow();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
