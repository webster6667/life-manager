export type FileInfo = {
  title: string
  lastEditTime: number
}

export type FileContent = string

export interface FileTreeNode {
  name: string
  path: string
  isDirectory: boolean
  children?: FileTreeNode[]
}
