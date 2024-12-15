import { useCallback, useEffect, useState } from 'react'
import { PrimaryNodeModel } from '@renderer/pages/paint/components/primary-node'
import { useRootStore } from '@renderer/api/easy-components'

export const useResizeShape = (node: PrimaryNodeModel) => {
  const { width = 300, height = 200 } = JSON.parse(JSON.stringify(node.data || '')) || {}
  const rootStore = useRootStore()
  const zoom = rootStore.diagramState.zoom

  const [isResizing, setIsResizing] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)

  const [originalWidth, setOriginalWidth] = useState(width)
  const [originalHeight, setOriginalHeight] = useState(height)

  const handleResizeStart = useCallback((e) => {
    setIsResizing(true)
    setStartX(e.clientX)
    setStartY(e.clientY)
    setOriginalWidth(width)
    setOriginalHeight(height)
    e.stopPropagation()
  }, [])

  const handleResize = useCallback(
    (e) => {
      if (isResizing) {
        const deltaX = e.clientX - startX
        const deltaY = e.clientY - startY
        const newWidth = Math.max(50, originalWidth + deltaX / zoom)
        const newHeight = Math.max(50, originalHeight + deltaY / zoom)

        node.data.width = newWidth
        node.data.height = newHeight

        setOriginalWidth(newWidth)
        setOriginalHeight(newHeight)
      }
    },
    [isResizing, node]
  )

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false)
    document.body.style.userSelect = '' // Восстанавливаем выделение текста
  }, [])

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResize)
      window.addEventListener('mouseup', handleResizeEnd)
    } else {
      window.removeEventListener('mousemove', handleResize)
      window.removeEventListener('mouseup', handleResizeEnd)
    }
    return () => {
      window.removeEventListener('mousemove', handleResize)
      window.removeEventListener('mouseup', handleResizeEnd)
    }
  }, [isResizing, handleResize, handleResizeEnd])

  return { isResizing, handleResizeStart, originalWidth, originalHeight }
}
