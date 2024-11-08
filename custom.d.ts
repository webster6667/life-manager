declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.png?asset' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

declare module '*.woff' {
  const content: string
  export default content
}
declare module '*.woff2' {
  const content: string
  export default content
}
declare module '*.eot' {
  const content: string
  export default content
}
declare module '*.ttf' {
  const content: string
  export default content
}

import { ElectronAPI } from '@electron-toolkit/preload'
import { ReadFile, WriteFile, CreateDirectory, DeleteFile, ReadDir } from '@common-shared/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    context: {
      locale: string
      createDirectory: CreateDirectory
      createFile: WriteFile
      updateFile: WriteFile
      readFile: ReadFile
      readDir: ReadDir
      deleteFile: DeleteFile
    }
  }
}
