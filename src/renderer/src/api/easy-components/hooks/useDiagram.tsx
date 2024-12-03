import React, { useMemo } from 'react'
import { Diagram } from '@easy-diagram/components/Diagram'
import type { IDiagramInitState } from '@easy-diagram/components/DiagramContext'
import { RootStore } from '@easy-diagram/states/rootStore'
import type { ISettings } from '@easy-diagram/states/rootStore'
import { useNotifyRef } from '@easy-diagram/hooks/useNotifyRef'

export const useDiagram = (initState?: IDiagramInitState, settings?: ISettings) => {
  const storeRef = useNotifyRef<RootStore | null>(null)

  const obj = useMemo(
    () => ({
      Diagram: () => <Diagram storeRef={storeRef} initState={initState} settings={settings} />,
      storeRef
    }),
    []
  )

  return obj
}
