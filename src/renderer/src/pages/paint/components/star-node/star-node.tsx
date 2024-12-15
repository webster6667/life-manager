import { observer } from 'mobx-react-lite'
import { INodeVisualComponentProps, Port, useRootStore } from '@renderer/api/easy-components'
import React from 'react'
import { useResizeShape } from '@renderer/pages/paint/hooks/useResizeShape'
import { ResizeHandle } from '@renderer/pages/paint/components/primary-node/styles'

export const StarNode = observer<INodeVisualComponentProps>(({ entity: node }) => {
  const { handleResizeStart, originalWidth, originalHeight } = useResizeShape(node)

  return (
    <div
      className="react_fast_diagram_NodeDefault"
      style={{
        padding: 15,
        border: node.selected ? '#6eb7ff solid 1px' : '',
        width: `${originalWidth}px`,
        height: `${originalHeight}px`
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
      }}
    >
      test
      {Array.from(node.ports).map(([id]) => (
        <Port id={id} key={id} />
      ))}
      <ResizeHandle data-element="resizer" onMouseDown={handleResizeStart} />
    </div>
  )
})
