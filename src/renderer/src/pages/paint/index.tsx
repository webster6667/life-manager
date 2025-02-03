import { TemplateGrid } from '@renderer/draft/root-layout/ui/template-grid'
import { RootSidebar } from '@renderer/pages/paint/root-sidebar'
import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { CanvasDiagram } from '@renderer/pages/paint/canvas-diagram'
import { useDidMount } from '@renderer/front-shared/hooks'
import { fileSystemAdapter } from '@renderer/api/fileSystemAdapter'
import { NoteView } from './note-view'
import { KanbanBoard } from './kanban'

const SelectedDataByType = ({ selectedFilePath }: { selectedFilePath: string }) => {
  const [isInitDataReady, initData] = useDidMount(async () => {
    const data = await fileSystemAdapter.readFile(selectedFilePath)

    try {
      console.log(JSON.parse(data), 'test')
    } catch {
      const lastIndex = data.lastIndexOf('}', data.length - 2)

      return JSON.parse(data.slice(0, lastIndex + 1))
    }

    return JSON.parse(data)
  })

  if (!isInitDataReady) {
    return <div>process</div>
  }

  const selectedFileType = initData.type || 'note'

  return {
    note: <NoteView selectedFilePath={selectedFilePath} initData={initData} />,
    canvas: <CanvasDiagram selectedFilePath={selectedFilePath} initData={initData} />,
    kanban: <KanbanBoard selectedFilePath={selectedFilePath} initData={initData} />
  }[selectedFileType]
}

const DiagramWithNodes = observer(() => {
  const [selectedFile, setSelectedFile] = useState<string | undefined>()

  useEffect(() => {
    localStorage.setItem('selectedFile', selectedFile || '')
  }, [selectedFile])

  return (
    <TemplateGrid
      sidebarContent={() => (
        <RootSidebar selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
      )}
      selectedContend={() =>
        selectedFile ? (
          <SelectedDataByType selectedFilePath={selectedFile} />
        ) : (
          <div>Файл не выбран</div>
        )
      }
    />
  )
})

export default DiagramWithNodes
