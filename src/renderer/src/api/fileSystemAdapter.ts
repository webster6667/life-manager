import { WriteFile, ReadFile, DeleteFile, CreateDirectory, ReadDir } from '@common-shared/types'

type FileSystemAdapter = {
  createFile: WriteFile
  updateFile: WriteFile
  readFile: ReadFile
  readDir: ReadDir
  deleteFile: DeleteFile
  createDirectory: CreateDirectory
}

export const fileSystemAdapter: FileSystemAdapter = {
  createFile: async (filePath, content) => {
    try {
      return await window.context.createFile(filePath, content)
    } catch (error) {
      console.error('Error creating file:', error.message)
      throw error
    }
  },

  updateFile: async (filePath, content) => {
    try {
      return await window.context.updateFile(filePath, content)
    } catch (error) {
      console.error('Error creating file:', error.message)
      throw error
    }
  },

  readFile: async (filePath) => {
    try {
      return await window.context.readFile(filePath)
    } catch (error) {
      console.error('Error reading file:', error.message)
      throw error
    }
  },

  readDir: async (filePath, params) => {
    try {
      return await window.context.readDir(filePath, params)
    } catch (error) {
      console.error('Error reading dir:', error.message)
      throw error
    }
  },

  deleteFile: async (filePath) => {
    try {
      await window.context.deleteFile(filePath)
    } catch (error) {
      console.error('Error deleting file:', error.message)
      throw error
    }
  },

  createDirectory: async (dirPath) => {
    try {
      return await window.context.createDirectory(dirPath)
    } catch (error) {
      console.error('Error creating directory:', error.message)
      throw error
    }
  }
}
