import { app, BrowserWindow } from "electron";
import * as path from "path";
import isDev from "electron-is-dev";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | null = null;

// node-pty is not yet context aware
app.allowRendererProcessReuse = false;

// Tracks whether the app is ready. We can't open the main window until that's true.
let ready = false;

// Create the main app window.
function createWindow() {
    if (ready !== true) {
        return;
    }

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 900,
        height: 680,
        webPreferences: {
            //
            // IMPORTANT: Node integration is required to run node-pty in the renderer process.
            //

            nodeIntegration: true,

            //
            // Load preload scripts and Electron main processes in the same v8 isolate. Currently
            // required for some dependencies like xterm.
            //

            contextIsolation: false,

            //
            // Don't block dev server with CORS.
            //

            webSecurity: false,

            //
            // IMPORTANT: Set a global variable in the renderer to indicate whether it was loaded in
            // Electron or in the browser.
            //

            //preload: path.resolve(__dirname, "..", "public", "electron_set_loaded_in_app.js"),
        },
    });

    mainWindow.loadURL(`file://${path.join(__dirname, "../..", "index.html")}`);

    mainWindow.maximize();

    // Emitted when the window is closed.
    mainWindow.on("closed", function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    if (isDev) {
        // Open DevTools, see https://github.com/electron/electron/issues/12438 for why we wait for
        // dom-ready
        mainWindow.webContents.once("dom-ready", () => {
            mainWindow!.webContents.openDevTools();
        });
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
    ready = true;
    createWindow();
});
