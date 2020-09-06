const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const { platform } = require('os');

let mainWindow = null;
let anWindow = null;

app.on('ready',()=>{
    
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,

        webPreferences: {
            nodeIntegration: true
        },
        show: false
    });

    mainWindow.loadFile(`${__dirname}/web/main.html`);

    const mainMenu = Menu.buildFromTemplate(menuTempate);
    // console.log(mainMenu);
    Menu.setApplicationMenu(mainMenu)

    mainWindow.on('closed',()=>{
        app.quit();
    })

    mainWindow.once('ready-to-show',(event)=>{
        mainWindow.show()
        mainWindow.webContents.openDevTools();
        console.log("BroswerWindows opened ", BrowserWindow.getAllWindows().length)
    });
});

ipcMain.on('todo:add',(event, message)=>{
    // console.log(event);
    mainWindow.webContents.send("todo:add",message);
    anWindow.close();
})

function createWindow(){
    anWindow = new BrowserWindow({
        width: 300,
        height: 200,
        webPreferences:{
            nodeIntegration: true
        },
        show: true
    })

    anWindow.loadFile(`${__dirname}/web/add.html`);

    anWindow.on('closed',()=>anWindow = null);
}






const menuTempate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New todo',
                click(){
                    // console.log('new window clicked');
                    createWindow();
                }
            },
            {
                label: 'Clear Todo',
                click(item, focusedWindow){
                    mainWindow.webContents.send("todo:clear")
                }
            },
            {
                label: 'Quit',
                accelerator:(()=>{
                    console.log('invoked immediately');
                    if(process.platform == 'linux'){
                        console.log('huha');
                        return 'Ctrl + Q';
                    }

                    if(process.platform == 'darwin'){
                        console.log("I am on darwin platform");
                        return 'Command + Q'
                    }


                })(),
                click(){
                    app.quit();
                }
            }
        ]
    },
]


if(process.env.NODE_ENV != 'production'){

    menuTempate.push({

        label:'View',
        submenu: [
            {
                role: 'reload'
            },
            {
                label: 'Toggle Developer tools',
                accelerator: 'Ctrl + Shift + I',
                click(item,focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            }
        ]
        
    })

}

