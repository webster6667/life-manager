import React, { FC, useState } from 'react'

import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack
} from '@mui/material'
import {
  Folder,
  FolderOpen,
  InsertDriveFile,
  CreateNewFolder,
  NoteAdd,
  Delete
} from '@mui/icons-material'
import { useDidMount } from '@common-hook'
import { fileSystemAdapter } from '@renderer/api/fileSystemAdapter'
import { FileTreeNode } from '@common-shared/models'
import { paintDirectoryName } from '@common-shared/constants'

import DragIndicatorIcon from '@mui/icons-material/DragIndicator'

interface FileTreeProps {
  nodes: FileTreeNode[]
  deleteHandler: (path: string) => void
  createHandler: (type: 'dir' | 'file', path: string) => void
  selectedFile: string
  setSelectedFile: (string) => void
}

export function getUniqueFileName(
  root: FileTreeNode[], // Массив корневых элементов
  name: string // Имя, для которого проверяем уникальность
): string {
  const existingNames = new Set<string>()

  // Функция для поиска всех узлов с данным именем на том же уровне
  const findNamesAtLevel = (nodes: FileTreeNode[]) => {
    nodes.forEach((node) => {
      // Добавляем имя в набор, если оно уже существует
      existingNames.add(node.name)

      // Рекурсивно ищем на уровне детей, если они есть
      if (node.children) {
        findNamesAtLevel(node.children)
      }
    })
  }

  // Ищем имена на всех уровнях
  findNamesAtLevel(root)

  // Если имя уникально, сразу возвращаем его
  if (!existingNames.has(name)) {
    return name
  }

  // Добавляем суффикс с инкрементирующим числом, если имя уже существует
  let suffix = 1
  let newName = ''
  const baseName = name.includes('.') ? name.slice(0, name.lastIndexOf('.')) : name
  const extension = name.includes('.') ? name.slice(name.lastIndexOf('.')) : ''

  do {
    newName = `${baseName} (${suffix})${extension}`
    suffix++
  } while (existingNames.has(newName))

  return newName
}

const FileTree: FC<FileTreeProps> = ({
  nodes,
  createHandler,
  deleteHandler,
  selectedFile,
  setSelectedFile
}) => {
  // Состояние "открытия" для каждого узла
  const [openNodes, setOpenNodes] = useState<Record<string, boolean>>({})

  const handleToggle = (path: string) => {
    setOpenNodes((prev) => ({
      ...prev,
      [path]: !prev[path]
    }))
  }

  const renderTree = (node: FileTreeNode) => {
    const isOpen = openNodes[node.path] || false
    const clearPath = node.path.replace('/Users/aleksandr/ElectronLayout/', '')
    const newDirName = getUniqueFileName(node.children || [], `Новая папка`)
    const newFileName = getUniqueFileName(node.children || [], `Новый файл.json`)
    const newDirPath = `${clearPath}/${newDirName}`
    const newFilePath = `${clearPath}/${newFileName}`

    return (
      <React.Fragment key={node.path}>
        <ListItemButton
          selected={selectedFile === node.path}
          onClick={() => {
            if (node.isDirectory) {
              handleToggle(node.path)
            } else {
              // TODO: Поправить странный костыль с не отрабатывающим onImportedStateRendered
              setSelectedFile('')
              setTimeout(() => {
                setSelectedFile(node.path)
              }, 10)
            }
          }}
        >
          <ListItemIcon>
            {node.isDirectory ? isOpen ? <FolderOpen /> : <Folder /> : <InsertDriveFile />}
          </ListItemIcon>
          <ListItemText primary={node.name} />
          <Stack
            flexGrow="1"
            flexDirection="row"
            justifyContent="end"
            onClick={(e) => e.stopPropagation()}
          >
            {node.isDirectory && (
              <>
                <ListItemIcon
                  sx={{ width: '30px', minWidth: 'auto' }}
                  onClick={() => createHandler('dir', newDirPath)}
                >
                  <CreateNewFolder />
                </ListItemIcon>
                <ListItemIcon
                  sx={{ width: '30px', minWidth: 'auto' }}
                  onClick={() => createHandler('file', newFilePath)}
                >
                  <NoteAdd />
                </ListItemIcon>
              </>
            )}
            <ListItemIcon
              sx={{ width: '30px', minWidth: 'auto' }}
              onClick={() => deleteHandler(clearPath)}
            >
              <Delete />
            </ListItemIcon>
            {!node.isDirectory && (
              <Box
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData('text/plain', node.path)
                }}
                sx={{
                  cursor: 'grab', // Изменяем курсор для наглядности
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <DragIndicatorIcon />
              </Box>
            )}
          </Stack>
        </ListItemButton>
        {node.isDirectory && node.children && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {node.children.map((child) => renderTree(child))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    )
  }

  return <List>{nodes.map((node) => renderTree(node))}</List>
}
export const RootSidebar: FC<{ selectedFile: string; setSelectedFile: (string) => void }> = ({
  selectedFile,
  setSelectedFile
}) => {
  const [canvasFileList, setCanvasFileList] = useState<FileTreeNode[]>()

  const [isDataUploaded] = useDidMount(async () => {
    const canvasReadFiles = (await fileSystemAdapter.readDir(paintDirectoryName, {
      createIfNotExist: true,
      isRecursive: true
    })) as FileTreeNode[]

    setCanvasFileList(canvasReadFiles)
  })

  const createHandler = async (type: 'dir' | 'file', path: string) => {
    if (type === 'dir') {
      await fileSystemAdapter.createDirectory(path)
    } else {
      await fileSystemAdapter.createFile(path, '{}')
    }

    const canvasReadFiles = (await fileSystemAdapter.readDir(paintDirectoryName, {
      createIfNotExist: true,
      isRecursive: true
    })) as FileTreeNode[]

    setCanvasFileList(canvasReadFiles)
  }

  const deleteHandler = async (path: string) => {
    await fileSystemAdapter.deleteFile(path)

    const canvasReadFiles = (await fileSystemAdapter.readDir(paintDirectoryName, {
      createIfNotExist: true,
      isRecursive: true
    })) as FileTreeNode[]

    setCanvasFileList(canvasReadFiles)
  }

  if (!isDataUploaded) {
    return <CircularProgress />
  }

  return (
    <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      {canvasFileList && canvasFileList.length > 0 && (
        <FileTree
          nodes={canvasFileList}
          deleteHandler={deleteHandler}
          createHandler={createHandler}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
      )}
      <Stack>
        <Button
          onClick={() => {
            const newDirName = getUniqueFileName(canvasFileList, 'Новая папка')

            createHandler('dir', `${paintDirectoryName}/${newDirName}`)
          }}
        >
          Создать папку
        </Button>
        <Button
          onClick={() => {
            const newFileName = getUniqueFileName(canvasFileList, 'Новый файл.json')

            createHandler('file', `${paintDirectoryName}/${newFileName}`)
          }}
        >
          Создать файл
        </Button>
      </Stack>
    </List>
  )
}
