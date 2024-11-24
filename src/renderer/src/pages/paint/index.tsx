import { CanvasWidget } from '@projectstorm/react-canvas-core'

import { CanvasWrapper } from '@renderer/pages/paint/components/ui/canvas-wrapper'

import { CircularProgress } from '@mui/material'
import { useCanvas } from '@renderer/pages/paint/hooks/use-canvas'

const DiagramWithNodes = () => {
  const { engine, isCanvasReadyToPaint } = useCanvas()

  return (
    <CanvasWrapper>
      {isCanvasReadyToPaint ? <CanvasWidget engine={engine} /> : <CircularProgress />}
    </CanvasWrapper>
  )
}

export default DiagramWithNodes
