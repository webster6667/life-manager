import React, { useCallback } from 'react'
import { useGesture, WebKitGestureEvent } from '@use-gesture/react'
import { useRootStore } from '@easy-diagram/hooks/useRootStore'
import { useDiagramDragHandlers } from '@easy-diagram/hooks/userInteractions/useDiagramDragHandlers'
import { useDiagramPinchHandlers } from '@easy-diagram/hooks/userInteractions/useDiagramPinchHandlers'
import { useDiagramWheelHandler } from '@easy-diagram/hooks/userInteractions/useDiagramWheelHandler'

export const useDiagramUserInteraction = () => {
  const { diagramState, diagramSettings } = useRootStore()

  const cancelGesture = useCallback(
    (event: { target: EventTarget | null }) => event.target !== diagramState.ref.current,
    [diagramState.ref]
  )

  const dragHandlers = useDiagramDragHandlers(cancelGesture)
  const pinchHandlers = useDiagramPinchHandlers(cancelGesture)
  const wheelHandler = useDiagramWheelHandler(diagramState)

  useGesture(
    {
      ...dragHandlers,
      ...pinchHandlers,
      ...wheelHandler
    },
    {
      target: diagramState.ref,
      eventOptions: { passive: false },
      enabled: !diagramSettings.userInteraction.arePointerInteractionsDisabled
    }
  )
}
