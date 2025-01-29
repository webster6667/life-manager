import { FC, useState } from 'react'

import { fileSystemAdapter } from '@renderer/api/fileSystemAdapter'
import { MarkdownEditor } from '@renderer/draft/root-layout/components/mark-down-editor'
import { debounce } from 'lodash'
import { EditorContainer } from './components/star-node/styles'

const listener = (content, selectedFilePath) => {
  fileSystemAdapter.updateFile(
    selectedFilePath,
    JSON.stringify({
      type: 'note',
      content
    })
  )
}

// Создаем debounced-функцию, которая будет вызываться только после 300 мс тишины
export const debouncedListener = debounce(listener, 300)

export const NoteView: FC<{ selectedFilePath: string; initData: object }> = ({
  selectedFilePath,
  initData
}) => {
  const [description, setDescription] = useState(initData?.content || '')

  return (
    <EditorContainer>
      <MarkdownEditor
        value={description}
        onChange={(newValue) => {
          setDescription(newValue)
          debouncedListener(newValue, selectedFilePath)
        }}
      />
    </EditorContainer>
  )
}
