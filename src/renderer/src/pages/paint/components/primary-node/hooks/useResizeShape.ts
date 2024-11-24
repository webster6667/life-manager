import { useCallback, useEffect, useState } from 'react'
import { PrimaryNodeModel } from '@renderer/pages/paint/components/primary-node'

export const useResizeShape = (node: PrimaryNodeModel) => {
  const [isResizing, setIsResizing] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)

  const [originalWidth, setOriginalWidth] = useState(node.options.width || 100)
  const [originalHeight, setOriginalHeight] = useState(node.options.height || 100)

  const handleResizeStart = useCallback((e) => {
    setIsResizing(true)
    setStartX(e.clientX)
    setStartY(e.clientY)
    setOriginalWidth(node.options.width || 100)
    setOriginalHeight(node.options.height || 100)
    e.stopPropagation()
  }, [])

  const handleResize = useCallback(
    (e) => {
      if (isResizing) {
        const deltaX = e.clientX - startX
        const deltaY = e.clientY - startY
        const newWidth = Math.max(50, originalWidth + deltaX)
        const newHeight = Math.max(50, originalHeight + deltaY)

        node.options.width = newWidth
        node.options.height = newHeight

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
