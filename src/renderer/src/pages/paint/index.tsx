import { Canvas } from './canvas'

import { TemplateGrid } from '@renderer/draft/root-layout/ui/template-grid'
import { RootSidebar } from '@renderer/pages/paint/root-sidebar'
import { useState } from 'react'

const DiagramWithNodes = () => {
  const [selectedFile, setSelectedFile] = useState<string | undefined>()

  return (
    <TemplateGrid
      sidebarContent={() => (
        <RootSidebar selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
      )}
      selectedContend={() =>
        selectedFile ? <Canvas selectedFile={selectedFile} /> : <div>Файл не выбран</div>
      }
    />
  )
}

export default DiagramWithNodes
