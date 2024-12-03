import { DiagramContext, IDiagramContextProps } from '@easy-diagram/components/DiagramContext'
import { DigramInner, IDiagramInnerProps } from '@easy-diagram/components/DiagramInner'
import React from 'react'

export type IDiagramProps = IDiagramInnerProps & IDiagramContextProps

export function Diagram(props: IDiagramProps) {
  return (
    <DiagramContext initState={props.initState} settings={props.settings} storeRef={props.storeRef}>
      <DigramInner children={props.children} />
    </DiagramContext>
  )
}
