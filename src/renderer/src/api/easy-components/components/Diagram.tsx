import { DiagramContext, IDiagramContextProps } from '@easy-diagram/components/DiagramContext'
import { DigramInner, IDiagramInnerProps } from '@easy-diagram/components/DiagramInner'
import React from 'react'

export type IDiagramProps = IDiagramInnerProps & IDiagramContextProps

export function Diagram({ initState, settings, storeRef, children, ...props }: IDiagramProps) {
  return (
    <DiagramContext initState={initState} settings={settings} storeRef={storeRef}>
      <DigramInner children={children} {...props} />
    </DiagramContext>
  )
}
