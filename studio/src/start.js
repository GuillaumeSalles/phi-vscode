const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const url = require("url");
const { makeMenu } = require("./menu");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  function onNew() {
    mainWindow.webContents.send("actions", "new-project");
  }

  function onOpen() {
    mainWindow.webContents.send("actions", "open-project");
  }

  function onSave() {
    mainWindow.webContents.send("actions", "save-project");
  }

  electron.Menu.setApplicationMenu(makeMenu({ onNew, onOpen, onSave }));

  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
      url.format({
        pathname: path.join(__dirname, "/../public/index.html"),
        protocol: "file:",
        slashes: true
      })
  );

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
