import React, { useContext, useEffect } from 'react'
import { NodeState } from '@easy-diagram/states/nodeState'
import { observer } from 'mobx-react-lite'
import { NodeContext } from '@easy-diagram/components/node/NodeWrapper'
import { useRelativePositionStyles } from '@easy-diagram/hooks/useRelativePositionStyles'
import { usePortUserInteraction } from '@easy-diagram/hooks/userInteractions/usePortUserInteraction'
import { DISABLE_NODE_USER_INTERACTION_CLASS } from '@easy-diagram/hooks/userInteractions/useNodeUserInteraction'
import { useRootStore } from '@easy-diagram/hooks/useRootStore'
import { PrimaryNodeNavigation } from '@renderer/pages/paint/components/star-node/components/primary-node-navigation'
import { shapeList } from '@renderer/pages/paint/components/star-node/const'
import { Box } from '@mui/material'
import { addNodeCommand } from '@easy-diagram/commands/addNode'

export interface IPortProps {
  id: string
  nodeData: {
    id: string
    position: [number, number]
  }
}

export const Port: React.FC<IPortProps> = observer(({ nodeData, ...props }) => {
  const { diagramSettings, linksStore, commandExecutor } = useRootStore()
  const node = useContext(NodeContext) as NodeState // node should already exist
  const portState = node.getPort(props.id)

  const positionStyles = useRelativePositionStyles(
    portState?.position,
    portState?.offsetFromNodeCenter,
    portState?.offsetFromOrigin
  )

  const { bind } = usePortUserInteraction(portState)

  useEffect(() => {
    // Prevent from recalculating on first load
    if (portState && portState.offsetRecalculationRequested > 0) {
      portState?.recalculateOffsetImmediately()
    }
  }, [portState, portState?.offsetRecalculationRequested])

  if (!portState) {
    return null
  }

  let className = DISABLE_NODE_USER_INTERACTION_CLASS
  if (!diagramSettings.userInteraction.arePointerInteractionsDisabled) {
    // Disable touch actions as useGesture library recommends
    className += ' react_fast_diagram_touch_action_disabled'
  }

  const navigationItemClickHandler = (value) => {
    const newNodeId = `node${Math.random().toString(36).substring(2, 7)}`
    const direction = portState.linkDirection

    const newNodeCoords = {
      left: {
        coords: [nodeData.position[0] - node.data.width - 100 || 0, nodeData.position[1] || 0],
        target: 'right'
      },
      right: {
        coords: [nodeData.position[0] + node.data.width + 100 || 0, nodeData.position[1] || 0],
        target: 'left'
      },
      up: {
        coords: [nodeData.position[0] || 0, nodeData.position[1] - node.data.height - 100 || 0],
        target: 'bottom'
      },
      down: {
        coords: [nodeData.position[0] || 0, nodeData.position[1] + node.data.height + 100 || 0],
        target: 'top'
      }
    }

    commandExecutor.execute(
      addNodeCommand({
        id: newNodeId,
        position: newNodeCoords[direction].coords,
        type: 'star',
        data: {
          width: 300,
          height: 100,
          shape: value
        }
      })
    )

    const link = {
      id: `link${Math.random().toString(36).substring(2, 7)}`,
      source: { nodeId: nodeData.id, portId: props.id },
      target: { nodeId: newNodeId, portId: newNodeCoords[direction].target },
      type: 'default'
    }

    console.log(link, 'link')

    linksStore.addLink(link)
  }

  return (
    <div
      style={positionStyles}
      id={portState.fullId}
      className={className + ' port-wrapper'}
      ref={portState.ref}
      key={portState.fullId}
      {...bind()}
    >
      <Box sx={{ position: 'absolute', left: '100%' }}>
        {portState.hovered && (
          <PrimaryNodeNavigation
            navigationItemClickHandler={navigationItemClickHandler}
            shapeOptions={{
              shape: shapeList.navItems[0].value
            }}
          />
        )}
      </Box>
      <portState.componentDefinition.component
        entity={portState}
        settings={portState.componentDefinition.settings}
      />
    </div>
  )
})
