import { observer } from 'mobx-react-lite'
import { INodeVisualComponentProps, Port } from '@renderer/api/easy-components'
import React, { useState } from 'react'
import hexToRgb from 'hex-to-rgb'

import { useResizeShape } from '@renderer/pages/paint/hooks/useResizeShape'
import { ResizeHandle } from '@renderer/pages/paint/components/primary-node/styles'
import { NavigationItemValue } from './types'
import { PrimaryNodeNavigation } from './components/primary-node-navigation'
import { colorList, shapeList, borderList, textAlignList } from '@renderer/pages/paint/components/star-node/const'
import { MarkdownEditor } from '@renderer/draft/root-layout/components/mark-down-editor'
import { NodeContainer, EditorContainer } from './styles'

export const StarNode = observer<INodeVisualComponentProps>(({ entity: node }) => {
  const { handleResizeStart, originalWidth, originalHeight } = useResizeShape(node)
  const [shapeOptions, setShapeOptions] = useState({
    shape: node?.data?.shape || shapeList.navItems[0].value,
    color: node?.data?.color || colorList.navItems[0].value,
    border: node?.data?.border || borderList.navItems[0].value,
    align: node?.data?.align || textAlignList.navItems[0].value
  })
  const [description, setDescription] = useState(node?.data?.content || '')

  const navigationItemClickHandler = (value: string, navigationValue: NavigationItemValue) => {
    setShapeOptions((prev) => {
      const newOptions = { ...prev }
      newOptions[navigationValue] = value
      return newOptions
    })
    node.data[navigationValue] = value
  }

  const isSelected = node.selected
  const isDefaultColor = shapeOptions.color === colorList.navItems[0].value

  return (
    <div
      className={`react_fast_diagram_NodeDefault`}
      style={{
        width: `${originalWidth}px`,
        height: `${originalHeight}px`
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
      }}
    >
      {isSelected && (
        <PrimaryNodeNavigation
          navigationItemClickHandler={navigationItemClickHandler}
          shapeOptions={shapeOptions}
        />
      )}

      <NodeContainer inFocused={isSelected} className={shapeOptions.shape + ' ' + shapeOptions.color.replace('#', '')} style={{background: isDefaultColor ? '#1e1e1e' : `rgba(${hexToRgb(shapeOptions.color)}, 0.2)`, borderColor: shapeOptions.color, borderStyle: shapeOptions.shape === 'rhomb' ? 'none' : shapeOptions.border, borderWidth: '1px', outline: isSelected ? `2px solid ${shapeOptions.color}` : 'none'}} >
      
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 141.42135624 141.42135624" preserveAspectRatio="none">
            <rect 
              rx="8" 
              x="20.71067812" 
              y="20.71067812" 
              width="100" 
              height="100" 
              style={{
                transformOrigin: "center",
                transform: "rotate(45deg) scale(1.05)",
                background: isDefaultColor ? '#1e1e1e' : `rgba(${hexToRgb(shapeOptions.color)}, 0.2)`,
              }}
              stroke={isDefaultColor ? '#c676ff' : shapeOptions.color}
              strokeWidth="3"
              strokeDasharray={{
                solid: '0',
                dashed: '2',
                dotted: '1',
              }[shapeOptions.border]} 
              fill="none"
            />
      </svg>

      </NodeContainer>
      <EditorContainer className={`align_${shapeOptions.align}`}>
        <MarkdownEditor value={description} onChange={(newValue) => {
          setDescription(newValue)
          node.data.content = newValue || ''
        }} />
      </EditorContainer>

      {Array.from(node.ports).map(([id]) => (
        <Port id={id} key={id} />
      ))}
      <ResizeHandle data-element="resizer" onMouseDown={handleResizeStart} />
    </div>
  )
})
