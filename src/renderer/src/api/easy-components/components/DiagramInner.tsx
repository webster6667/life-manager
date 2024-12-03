import React, { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { LinksLayer } from '@easy-diagram/components/link/LinksLayer'
import { NodesLayer } from '@easy-diagram/components/node/NodesLayer'
import { useDiagramUserInteraction } from '@easy-diagram/hooks/userInteractions/useDiagramUserInteraction'
import { observer } from 'mobx-react-lite'
import { useRootStore } from '@easy-diagram/hooks/useRootStore'
import { BackgroundWrapper } from '@easy-diagram/components/background/BackgroundWrapper'
import { MiniControlWrapper } from '@easy-diagram/components/miniControl/MiniControlWrapper'
import { generateTransform } from '@easy-diagram/utils/transformation'
import '../Diagram.css'
import { addNodeCommand } from '@renderer/api/easy-components'

export interface IDiagramInnerProps {
  diagramStyles?: React.CSSProperties
  children?: ReactNode | undefined
}

export const DigramInner = observer<IDiagramInnerProps>((props) => {
  const rootStore = useRootStore()
  useDiagramUserInteraction()

  useResizeAction(() => {
    rootStore.diagramState.ref.recalculateSizeAndPosition()
    rootStore.nodesStore.nodes.forEach((n) => n.recalculatePortsOffset())
  })

  const [{ offset, zoom }, setOffsetZoom] = useState({
    offset: rootStore.diagramState.offset,
    zoom: rootStore.diagramState.zoom
  })

  useEffect(() => {
    setOffsetZoom({
      offset: rootStore.diagramState.offset,
      zoom: rootStore.diagramState.zoom
    })
  }, [rootStore.diagramState.offset, rootStore.diagramState.zoom])

  const lastRenderedImportRef = useRef(-1)

  useLayoutEffect(() => {
    if (rootStore.diagramState.importGenerationId > lastRenderedImportRef.current) {
      lastRenderedImportRef.current = rootStore.diagramState.importGenerationId

      rootStore.callbacks.importedStateRendered()

      setOffsetZoom({
        offset: rootStore.diagramState.offset,
        zoom: rootStore.diagramState.zoom
      })
    }
  }, [rootStore.diagramState.importGenerationId])

  let className = 'react_fast_diagram_DiagramInner'
  if (!rootStore.diagramSettings.userInteraction.arePointerInteractionsDisabled) {
    // Disable touch actions as useGesture library recommends
    className += ' react_fast_diagram_touch_action_disabled'
  }

  const transform = generateTransform(offset, zoom)

  const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    const { clientX, clientY, currentTarget } = event
    const rect = currentTarget.getBoundingClientRect()

    // Координаты клика относительно контейнера
    const x = (clientX - rect.left - offset[0]) / zoom
    const y = (clientY - rect.top - offset[1]) / zoom
    const newNodeId = `node${Math.random().toString(36).substring(2, 7)}`

    rootStore.commandExecutor.execute(
      addNodeCommand({
        id: newNodeId,
        position: [x, y],
        type: 'star'
      })
    )

    // storeRef.current.commandExecutor.execute(
    //   addNodeCommand({
    //     id: newNodeId,
    //     position: [adjustedX, adjustedY],
    //     type: 'star'
    //   })
    // )

    // console.log(`Double click at: X: ${x}, Y: ${y}`)
  }

  return (
    <div
      ref={rootStore.diagramState.ref}
      style={props.diagramStyles}
      data-zoom={zoom}
      className={className}
      onDoubleClick={handleDoubleClick}
    >
      <BackgroundWrapper />
      <LinksLayer transform={transform} />
      <NodesLayer transform={transform} />
      {props.children}
      <MiniControlWrapper />
    </div>
  )
})

function useResizeAction(action: () => any) {
  const rootStore = useRootStore()

  useEffect(() => {
    window.addEventListener('resize', action)
    return () => window.removeEventListener('resize', action)
  }, [rootStore, action])
}
