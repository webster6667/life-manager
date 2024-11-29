import { DiagramEngine } from '@projectstorm/react-diagrams'
import { SecondaryNodeModel } from './index'
import { PrimaryPortModel } from './primary-port'

export interface SecondaryNodeModelGenerics {
  PORT: PrimaryPortModel
}

export interface SecondaryNodeWidgetProps {
  node: SecondaryNodeModel
  engine: DiagramEngine
  size?: number
}
