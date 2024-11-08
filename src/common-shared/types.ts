export type CreateDirectory = (dirPath: string) => Promise<string>

export type WriteFile = (filePath: string, content: string) => Promise<string>

export type ReadFile = (filePath: string) => Promise<string>
export type DeleteFile = (filePath: string) => Promise<void>

export type ReadDirParams = {
  createIfNotExist?: boolean
  shouldShowDotsFiles?: boolean
}

export type ReadDir = (filePath: string, params?: ReadDirParams) => Promise<string[]>
