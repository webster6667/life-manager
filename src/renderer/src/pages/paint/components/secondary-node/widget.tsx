import { FC } from 'react'
import { SecondaryNodeWidgetProps } from './types'
import { Box } from '@mui/material'
import { MarkdownEditor } from '@remirror/react-editors/markdown'
import { PortWidget } from '@projectstorm/react-diagrams'
import { Port } from './styles'
import { ports, portStyles } from './const'

export const SecondaryNodeWidget: FC<SecondaryNodeWidgetProps> = ({
  engine,
  node,
  parentPorts = []
}) => {
  return (
    <Box
      sx={{
        position: 'relative'
      }}
    >
      <div
        style={{
          width: node.options.width,
          height: node.options.height,
          border: `1px solid ${node.isSelected() ? 'red' : 'silver'}`
        }}
      >
        <MarkdownEditor autoFocus={false} />
      </div>

      {parentPorts.map((port) => {
        const alignment = port.options.alignment

        return (
          <PortWidget
            style={portStyles(node.options.width, node.options.height)[alignment]}
            port={port}
            engine={engine}
            key={port.options.id}
            // onClickCapture={(e) => {
            //   e.stopPropagation()
            // }}
          >
            <Port
            // onClickCapture={(e) => {
            //   e.stopPropagation()
            // }}
            />
          </PortWidget>
        )
      })}
    </Box>
  )
}
