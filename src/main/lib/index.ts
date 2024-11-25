import { homedir } from 'os'
import { appDirectoryName } from './../../common-shared/constants'
import {
  ensureDir,
  pathExists,
  outputFile,
  readFile as fsReadFile,
  remove,
  readdir,
  move
} from 'fs-extra'
import path from 'path'
import {
  CreateDirectory,
  WriteFile,
  ReadFile,
  DeleteFile,
  ReadDir,
  MoveFile
} from './../../common-shared/types'
import { FileTreeNode } from '@common-shared/models'

export const rootDir = `${homedir()}/${appDirectoryName}`

export const createDirectory: CreateDirectory = async (dirPath) => {
  const fullPath = path.resolve(rootDir, dirPath)

  try {
    await ensureDir(fullPath)
    return fullPath
  } catch (err) {
    console.error(`Error creating directory at ${fullPath}:`, err)
  }
}

export const createFile: WriteFile = async (filePath, content) => {
  const fullPath = path.resolve(rootDir, filePath)

  try {
    const fileExists = await pathExists(fullPath)
    if (fileExists) {
      throw new Error(`File already exists at ${fullPath}`)
    }

    try {
      await outputFile(fullPath, content)
      return filePath
    } catch (err) {
      throw new Error(`Failed to write file at ${fullPath}`)
    }
  } catch (err) {
    console.error(`Error creating file at ${fullPath}:`, err)
  }
}

export const updateFile: WriteFile = async (filePath, content) => {
  const fullPath = path.resolve(rootDir, filePath)

  try {
    const fileExists = await pathExists(fullPath)
    if (!fileExists) {
      throw new Error(`File does not exist at ${fullPath}`)
    }

    try {
      await outputFile(fullPath, content)
      return filePath
    } catch (err) {
      throw new Error(`Failed to update file at ${fullPath}`)
    }
  } catch (err) {
    console.error(`Error updating file at ${fullPath}:`, err)
  }
}

export const moveFile: MoveFile = async (sourcePath, destinationPath) => {
  const fullSourcePath = path.resolve(rootDir, sourcePath)
  const fullDestinationPath = path.resolve(rootDir, destinationPath)

  try {
    // Проверяем, существует ли исходный путь
    const sourceExists = await pathExists(fullSourcePath)
    if (!sourceExists) {
      throw new Error(`Source does not exist at ${fullSourcePath}`)
    }

    // Проверяем, не занят ли целевой путь
    const destinationExists = await pathExists(fullDestinationPath)
    if (destinationExists) {
      throw new Error(`Destination already exists at ${fullDestinationPath}`)
    }

    try {
      // Перемещаем/переименовываем
      await move(fullSourcePath, fullDestinationPath)
      return destinationPath
    } catch (err) {
      throw new Error(`Failed to move from ${fullSourcePath} to ${fullDestinationPath}`)
    }
  } catch (err) {
    console.error(`Error moving from ${fullSourcePath} to ${fullDestinationPath}:`, err)
  }
}

export const readFile: ReadFile = async (filePath) => {
  const fullPath = path.resolve(rootDir, filePath)

  try {
    const fileExists = await pathExists(fullPath)
    if (!fileExists) {
      throw new Error(`File does not exist at ${fullPath}`)
    }

    const content = await fsReadFile(fullPath, 'utf-8')
    return content
  } catch (err) {
    console.error(`Error read file at ${fullPath}:`, err)
  }
}

export const readDir: ReadDir = async (
  dirPath,
  { createIfNotExist = false, shouldShowDotsFiles = false, isRecursive = false }
) => {
  const fullPath = path.resolve(rootDir, dirPath)

  try {
    const dirExists = await pathExists(fullPath)
    if (!dirExists) {
      if (createIfNotExist) {
        await ensureDir(fullPath)
        console.log(`Directory created at ${fullPath}`)
      } else {
        throw new Error(`Directory does not exist at ${fullPath}`)
      }
    }

    if (isRecursive) {
      const readDirectoryRecursive = async (dirPath: string): Promise<FileTreeNode[]> => {
        const entries = await readdir(dirPath, { withFileTypes: true }).then((result) => {
          return result.filter((item) => !item.name.startsWith('.'))
        })

        const result: FileTreeNode[] = await Promise.all(
          entries.map(async (entry) => {
            const fullPath = path.join(dirPath, entry.name)
            const isDirectory = entry.isDirectory()

            if (isDirectory) {
              const children = await readDirectoryRecursive(fullPath)
              return {
                name: entry.name,
                path: fullPath,
                isDirectory: true,
                children
              }
            }

            return {
              name: entry.name,
              path: fullPath,
              isDirectory: false
            }
          })
        )

        return result
      }

      const contents = await readDirectoryRecursive(fullPath)

      return contents
    }

    const contents = await readdir(fullPath)
    return shouldShowDotsFiles ? contents : contents.filter((item) => !item.startsWith('.'))
  } catch (err) {
    console.error(`Error reading directory at ${fullPath}:`, err)
  }
}

export const deleteFile: DeleteFile = async (filePath) => {
  const fullPath = path.resolve(rootDir, filePath)

  try {
    const fileExists = await pathExists(fullPath)
    if (!fileExists) {
      throw new Error(`File does not exist at ${fullPath}`)
    }

    await remove(fullPath)
  } catch (err) {
    console.error(`Error delete file at ${fullPath}:`, err)
  }
}
