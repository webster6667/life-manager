import { observer } from 'mobx-react-lite'
import {
  IDiagramInitState,
  INodeVisualComponentProps,
  LinkCreationState,
  LinkDefault,
  LinkState,
  Port,
  useLinkUserInteraction,
  useRootStore,
  LinkWrapper
} from '@renderer/api/easy-components'
import React, { useState } from 'react'

import { useDidMount } from '@common-hook'
import { fileSystemAdapter } from '@renderer/api/fileSystemAdapter'
import { EditorContainer, NodeContainer } from '../star-node/styles'
import { hexToRgb } from '@mui/material'
import { borderList, colorList, shapeList, textAlignList } from '../star-node/const'
import { MarkdownEditor } from '@renderer/draft/root-layout/components/mark-down-editor'

export const StarNode = ({ node }) => {
  const {
    width = 300,
    height = 200,
    content,
    shape = shapeList.navItems[0].value,
    color = colorList.navItems[0].value,
    border = borderList.navItems[0].value,
    align = textAlignList.navItems[0].value
  } = JSON.parse(JSON.stringify(node?.data || '')) || {}
  const [isSelected, setIsSelected] = useState(false)
  const isDefaultColor = color === colorList.navItems[0].value

  return (
    <div
      className="react_fast_diagram_NodeDefault"
      style={{
        // padding: 15,
        border: isSelected ? '#6eb7ff solid 1px' : '',
        width: '100%',
        height: '100%'
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
      }}
    >
      <NodeContainer
        inFocused={isSelected}
        className={shape + ' ' + color.replace('#', '')}
        style={{
          background: isDefaultColor ? '#1e1e1e' : `rgba(${hexToRgb(color)}, 0.2)`,
          borderColor: color,
          borderStyle: shape === 'rhomb' ? 'none' : border,
          borderWidth: '1px',
          outline: isSelected ? `2px solid ${color}` : 'none'
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 141.42135624 141.42135624"
          preserveAspectRatio="none"
        >
          <rect
            rx="8"
            x="20.71067812"
            y="20.71067812"
            width="100"
            height="100"
            style={{
              transformOrigin: 'center',
              transform: 'rotate(45deg) scale(1.05)',
              background: isDefaultColor ? '#1e1e1e' : `rgba(${hexToRgb(color)}, 0.2)`
            }}
            stroke={isDefaultColor ? '#c676ff' : color}
            strokeWidth="3"
            strokeDasharray={
              {
                solid: '0',
                dashed: '2',
                dotted: '1'
              }[border]
            }
            fill="none"
          />
        </svg>
      </NodeContainer>
      <EditorContainer className={`align_${align}`}>
        <MarkdownEditor value={content} readonly />
      </EditorContainer>
      {Array.from(node.ports).map(({ id }) => {
        return <Port id={id + '_' + node.id} key={id} />
      })}
    </div>
  )
}

const offsetParams = {
  left: 0,
  top: 0
}
const portalSize = {
  height: 0,
  width: 0
}

export const PortalNode = observer<INodeVisualComponentProps>(({ entity: node }) => {
  const [isInitDataReady, initData] = useDidMount<IDiagramInitState>(async () => {
    const { portalFilePath } = JSON.parse(JSON.stringify(node.data || '')) || {}
    const data = await fileSystemAdapter.readFile(portalFilePath)

    JSON.parse(data).nodes.forEach(({ position, data }) => {
      const [nodeOffsetLeft, nodeOffsetTop] = position || [0, 0]
      const width = data.width || 0
      const heigth = data.height || 0

      // самый маленький в лево
      if (offsetParams.left === 0 || nodeOffsetLeft < offsetParams.left) {
        offsetParams.left = nodeOffsetLeft
      }

      // самый маленький в вверх
      if (offsetParams.top === 0 || nodeOffsetTop < offsetParams.top) {
        offsetParams.top = nodeOffsetTop
      }

      // Ширина
      if (nodeOffsetLeft + width > portalSize.width) {
        portalSize.width = nodeOffsetLeft + width
      }

      if (nodeOffsetTop + heigth > portalSize.height) {
        portalSize.height = nodeOffsetTop + heigth
      }
    })

    return JSON.parse(data)
  })

  console.log(offsetParams, portalSize, 'size')

  return (
    <div
      className="react_fast_diagram_NodeDefault"
      style={{
        border: node.selected ? '#6eb7ff solid 1px' : '',
        width: `${portalSize.width - offsetParams.left}px`,
        height: `${portalSize.height - offsetParams.top}px`
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
      }}
    >
      {isInitDataReady &&
        initData.nodes.map((node) => {
          return (
            <div
              id={node.id}
              key={node.id}
              style={{
                position: 'absolute',
                left: `${node.position[0] - offsetParams.left}px`,
                top: `${node.position[1] - offsetParams.top}px`,
                width: `${node.data.width}px`,
                height: `${node.data.height}px`
              }}
            >
              <StarNode node={node} />
            </div>
          )
        })}

      <svg className="react_fast_diagram_Layer">
        <g>
          {isInitDataReady &&
            initData.links.map((link) => (
              <LinkDefault key={link.id} offset={offsetParams} entity={link} bind={() => {}} />
            ))}
        </g>
      </svg>
    </div>
  )
})
