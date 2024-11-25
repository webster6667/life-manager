import { useCanvas } from '@renderer/pages/paint/hooks/use-canvas'
import { CanvasWidget } from '@projectstorm/react-canvas-core'
import { CircularProgress } from '@mui/material'
import { CanvasWrapper } from '@renderer/pages/paint/components/ui/canvas-wrapper'
import { FC } from 'react'

export const Canvas: FC<{ selectedFile: string }> = ({ selectedFile }) => {
  const { engine, isCanvasReadyToPaint } = useCanvas({ selectedFile })

  return (
    <CanvasWrapper style={{ width: '100%' }}>
      {isCanvasReadyToPaint ? <CanvasWidget engine={engine} /> : <CircularProgress />}
    </CanvasWrapper>
  )
}
