const {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Notification,
} = require('electron')
const path = require('node:path')
const { pathToFileURL } = require('node:url')

app.setName('FocusBoard')

const appId = 'com.erenmeray.focusboard'
const indexPath = path.join(__dirname, 'dist', 'index.html')
const indexUrl = pathToFileURL(indexPath).href

function createWindow() {
  const window = new BrowserWindow({
    width: 1100,
    height: 800,
    minWidth: 375,
    minHeight: 550,
    title: 'FocusBoard',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'electron-preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      backgroundThrottling: false,
    },
  })

  window.webContents.setWindowOpenHandler(() => ({
    action: 'deny',
  }))

  window.webContents.on('will-navigate', (event) => {
    event.preventDefault()
  })

  window.loadFile(indexPath).catch((error) => {
    dialog.showErrorBox(
      'FocusBoard açılamadı',
      `Uygulama dosyaları yüklenemedi: ${error.message}`,
    )
  })
}

app.whenReady().then(() => {
  app.setAppUserModelId(appId)

  ipcMain.handle('focusboard:notify', (event, taskTitle) => {
    const senderWindow = BrowserWindow.fromWebContents(event.sender)

    if (
      !senderWindow ||
      event.senderFrame !== event.sender.mainFrame ||
      event.senderFrame.url !== indexUrl
    ) {
      throw new Error('Bildirim isteğinin kaynağı geçersiz.')
    }

    if (
      typeof taskTitle !== 'string' ||
      !taskTitle.trim() ||
      taskTitle.length > 120
    ) {
      throw new Error('Görev başlığı geçersiz.')
    }

    if (!Notification.isSupported()) {
      return { ok: false, reason: 'Sistem bildirimleri desteklenmiyor.' }
    }

    const notification = new Notification({
      title: 'FocusBoard — Süre doldu!',
      body: `${taskTitle} için odak oturumun tamamlandı.`,
    })

    notification.on('click', () => {
      if (!senderWindow.isDestroyed()) {
        if (senderWindow.isMinimized()) senderWindow.restore()
        senderWindow.show()
        senderWindow.focus()
      }
    })

    notification.show()
    return { ok: true }
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})