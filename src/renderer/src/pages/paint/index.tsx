import { Canvas } from './canvas'

import { TemplateGrid } from '@renderer/draft/root-layout/ui/template-grid'
import { RootSidebar } from '@renderer/pages/paint/root-sidebar'
import { useContext, useEffect, useRef, useState } from 'react'
import { Diagram, RootStoreContext } from 'react-easy-diagram'
import { observer } from 'mobx-react-lite'
import { CanvasDiagram } from '@renderer/pages/paint/canvas-diagram'

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
        selectedFile ? <CanvasDiagram selectedFilePath={selectedFile} /> : <div>Файл не выбран</div>
      }
    />
  )
})

export default DiagramWithNodes
