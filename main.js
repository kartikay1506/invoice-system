const { app, Tray, BrowserWindow } = require('electron');
const server = require('./app');

function createWindow() {
    const window = new BrowserWindow({
        icon: __dirname+'/assets/images/tata_motors_app_icon.ico',
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        }
    });

    window.loadURL("http://localhost:5000/");
}

app.whenReady().then(createWindow);;

app.on('window-all-closed', () => {
    if(process.platform != 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});