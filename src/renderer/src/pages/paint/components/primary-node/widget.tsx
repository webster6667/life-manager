import { FC, useState } from 'react'
import { NavigationItemValue, PrimaryNodeWidgetProps } from './types'
import { Box } from '@mui/material'
import { MarkdownEditor } from '@remirror/react-editors/markdown'
import { PortWidget } from '@projectstorm/react-diagrams'
import { Port, ResizeHandle } from './styles'
import { ports, portStyles } from './const'
import { PrimaryNodeNavigation } from './components/primary-node-navigation'
import { useResizeShape } from '@renderer/pages/paint/components/primary-node/hooks/useResizeShape'

export const PrimaryNodeWidget: FC<PrimaryNodeWidgetProps> = ({ engine, node }) => {
  const { handleResizeStart, originalWidth, originalHeight } = useResizeShape(node)

  const [shapeOptions, setShapeOptions] = useState({
    shape: 'rectangle',
    color: 'silver',
    border: 'solid'
  })

  const navigationItemClickHandler = (value: string, navigationValue: NavigationItemValue) => {
    setShapeOptions((prev) => {
      const newOptions = { ...prev }
      newOptions[navigationValue] = value
      return newOptions
    })
  }

  const isNodeSelected = node.isSelected()

  return (
    <Box
      sx={{
        position: 'relative'
      }}
    >
      {isNodeSelected && (
        <PrimaryNodeNavigation navigationItemClickHandler={navigationItemClickHandler} />
      )}

      <div
        style={{
          width: originalWidth,
          height: originalHeight,
          border: `1px solid ${node.isSelected() ? 'red' : 'silver'}`,
          borderRadius: shapeOptions.shape === 'oval' ? '1000px' : '6px',
          backgroundColor: shapeOptions.color
        }}
      >
        <MarkdownEditor />
      </div>

      {ports.map((port) => (
        <PortWidget
          style={portStyles(originalWidth, originalHeight)[port]}
          port={node.getPort(port)}
          engine={engine}
          key={port}
        >
          <Port />
        </PortWidget>
      ))}

      <ResizeHandle onMouseDown={handleResizeStart} />
    </Box>
  )
}
