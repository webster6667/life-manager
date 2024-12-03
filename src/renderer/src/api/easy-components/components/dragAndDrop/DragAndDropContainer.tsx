import React, { CSSProperties, useMemo } from 'react'
import {
  DragAndDropItem,
  DragAndDropItemProps
} from '@easy-diagram/components/dragAndDrop/DragAndDropItem'
import { combineArrays } from '@easy-diagram/utils/common'

export interface DragAndDropContainerProps {
  items: DragAndDropItemProps[]
  classes?: string[]
  style?: CSSProperties
}

export function DragAndDropContainer(props: DragAndDropContainerProps) {
  const className = useMemo(
    () => combineArrays(['react_fast_diagram_DragAndDropContainer'], props?.classes).join(' '),
    [props.classes]
  )

  return (
    <div className={className} style={props.style}>
      {props.items?.map((item, index) => <DragAndDropItem key={index} {...item} />)}
    </div>
  )
}
