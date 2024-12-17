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
import React from 'react'

import { useDidMount } from '@common-hook'
import { fileSystemAdapter } from '@renderer/api/fileSystemAdapter'

export const StarNode = ({ node }) => {
  const { width = 300, height = 200 } = JSON.parse(JSON.stringify(node?.data || '')) || {}

  return (
    <div
      className="react_fast_diagram_NodeDefault"
      style={{
        // padding: 15,
        border: node.selected ? '#6eb7ff solid 1px' : '',
        width: '100%',
        height: '100%'
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
      }}
    >
      test
      {Array.from(node.ports).map(({ id }) => {
        return <Port id={id + '_' + node.id} key={id} />
      })}
    </div>
  )
}

export const PortalNode = observer<INodeVisualComponentProps>(({ entity: node }) => {
  const [isInitDataReady, initData] = useDidMount<IDiagramInitState>(async () => {
    const { portalFilePath } = JSON.parse(JSON.stringify(node.data || '')) || {}
    const data = await fileSystemAdapter.readFile(portalFilePath)

    return JSON.parse(data)
  })

  return (
    <div
      className="react_fast_diagram_NodeDefault"
      style={{
        border: node.selected ? '#6eb7ff solid 1px' : ''
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
                left: `${node.position[0]}px`,
                top: `${node.position[1]}px`,
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
              <LinkDefault key={link.id} entity={link} bind={() => {}} />
            ))}
        </g>
      </svg>
    </div>
  )
})
