import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ReadDirParams } from '../common-shared/types'

// Custom APIs for renderer
const api = {}

if (!process.contextIsolated) {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
} else {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)

    contextBridge.exposeInMainWorld('context', {
      locale: navigator.language,
      createFile: (filePath: string, content: string) =>
        ipcRenderer.invoke('createFile', filePath, content),
      updateFile: (filePath: string, content: string) =>
        ipcRenderer.invoke('updateFile', filePath, content),
      readFile: (filePath: string) => ipcRenderer.invoke('readFile', filePath),
      readDir: (dirPath: string, params: ReadDirParams) =>
        ipcRenderer.invoke('readDir', dirPath, params),
      deleteFile: (filePath: string) => ipcRenderer.invoke('deleteFile', filePath),
      createDirectory: (dirPath: string) => ipcRenderer.invoke('createDirectory', dirPath)
    })
  } catch (error) {
    console.error(error)
  }
}
