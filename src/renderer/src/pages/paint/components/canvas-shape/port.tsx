import { useState, FC } from 'react'

import { AbstractModelFactory, GenerateWidgetEvent } from '@projectstorm/react-canvas-core'
import { DiagramEngine, PortModel } from '@projectstorm/react-diagrams'

import { LabelModel } from '@projectstorm/react-diagrams'
import { DeserializeEvent } from '@projectstorm/react-canvas-core'

import { action } from '@storybook/addon-actions'

import {
  EditableLabelOptions,
  FlowAliasLabelWidgetProps
} from '@renderer/pages/paint/components/canvas-shape/types'
import { Label } from '@mui/icons-material'

export const PortLabelWidget: FC<FlowAliasLabelWidgetProps> = (props) => {
  const [str, setStr] = useState(props.model.value)

  return (
    <Label>
      <input
        value={str}
        onChange={(event) => {
          const newVal = event.target.value

          // update value both in internal component state
          setStr(newVal)
          // and in model object
          props.model.value = newVal
        }}
      />

      <button onClick={() => action('model eventDidFire')('You clicked the button')}>
        Click me!
      </button>
    </Label>
  )
}

export class PortLabelModel extends LabelModel {
  value: string

  constructor(options: EditableLabelOptions = {}) {
    super({
      ...options,
      type: 'editable-label'
    })
    this.value = options.value || ''
  }

  serialize() {
    return {
      ...super.serialize(),
      value: this.value
    }
  }

  deserialize(event: DeserializeEvent<this>): void {
    super.deserialize(event)
    this.value = event.data.value
  }
}

export class SimplePortFactory extends AbstractModelFactory<PortModel, DiagramEngine> {
  cb: (initialConfig?: any) => PortModel

  constructor(type: string, cb: (initialConfig?: any) => PortModel) {
    super(type)
    this.cb = cb
  }

  generateModel(event): PortModel {
    return this.cb(event.initialConfig)
  }

  generateReactWidget(event: GenerateWidgetEvent<PortLabelModel>): JSX.Element {
    return <PortLabelWidget model={event.model} />
  }
}
