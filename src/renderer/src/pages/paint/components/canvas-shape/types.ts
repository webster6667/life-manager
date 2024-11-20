import { DiagramEngine } from '@projectstorm/react-diagrams'
import { CanvasShapeModel, CanvasShapePortModel } from './index'
import { BaseModelOptions } from '@projectstorm/react-canvas-core'
import { PortLabelModel } from '@renderer/pages/paint/components/canvas-shape/port'

export interface CanvasShapeModelGenerics {
  PORT: CanvasShapePortModel
}

export interface CanvasShapeWidgetProps {
  node: CanvasShapeModel
  engine: DiagramEngine
  size?: number
}

export interface EditableLabelOptions extends BaseModelOptions {
  value?: string
}

export interface FlowAliasLabelWidgetProps {
  model: PortLabelModel
}
