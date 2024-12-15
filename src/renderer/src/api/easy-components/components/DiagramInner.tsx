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
import { addNodeCommand, RootStore } from '@renderer/api/easy-components'
import { fileSystemAdapter } from '@renderer/api/fileSystemAdapter'
import { debounce } from 'lodash'

export interface IDiagramInnerProps {
  diagramStyles?: React.CSSProperties
  children?: ReactNode | undefined
}

export const DigramInner = observer<IDiagramInnerProps>((props) => {
  const [selectionBox, setSelectionBox] = useState(null)
  const startCoords = useRef({ x: 0, y: 0 })

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
    rootStore.callbacks.changeOffset()
    rootStore.callbacks.changeZoom()
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
        type: 'star',
        data: {
          width: 300,
          height: 100,
          shape: 'square'
        }
      })
    )
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const targetElement = e.target as HTMLElement

    startCoords.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    setSelectionBox({ x: e.clientX, y: e.clientY, width: 0, height: 0 })

    if (targetElement.dataset.element === 'canvas') {
      rootStore.selectionState.unselectAll()
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()

    if (!selectionBox) return

    const currentX = e.clientX - rect.left
    const currentY = e.clientY - rect.top

    const width = e.clientX - startCoords.current.x - rect.left
    const height = e.clientY - startCoords.current.y - rect.top

    setSelectionBox({
      x: width < 0 ? currentX : startCoords.current.x,
      y: height < 0 ? currentY : startCoords.current.y,
      width: Math.abs(width),
      height: Math.abs(height)
    })
  }

  const handleMouseUp = () => {
    if (selectionBox) {
      const selectedNodes = rootStore.nodesStore.export().filter((node) => {
        const nodeX = node.position[0]
        const nodeY = node.position[1]
        const selectionBoxX = (selectionBox.x - offset[0]) / zoom
        const selectionBoxY = (selectionBox.y - offset[1]) / zoom

        return (
          nodeX >= selectionBoxX &&
          nodeY >= selectionBoxY &&
          nodeX <= selectionBoxX + selectionBox.width / zoom &&
          nodeY <= selectionBoxY + selectionBox.height / zoom
        )
      })

      for (const { id } of Object.values(selectedNodes)) {
        const nodeForSelect = rootStore.nodesStore.getNode(id)
        rootStore.selectionState.select(nodeForSelect, false)
      }

      setSelectionBox(null) // Сбрасываем выделение
    }
  }

  return (
    <div
      ref={rootStore.diagramState.ref}
      style={props.diagramStyles}
      data-zoom={zoom}
      data-element="canvas"
      className={className}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {selectionBox && (
        <div
          style={{
            position: 'absolute',
            left: selectionBox.x,
            top: selectionBox.y,
            width: Math.abs(selectionBox.width),
            height: Math.abs(selectionBox.height),
            backgroundColor: 'rgba(0, 120, 215, 0.2)',
            border: '1px solid rgba(0, 120, 215, 0.5)',
            pointerEvents: 'none'
          }}
        />
      )}

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
