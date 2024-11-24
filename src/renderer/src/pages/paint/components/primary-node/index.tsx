import { AbstractReactFactory } from '@projectstorm/react-canvas-core'
import {
  DiagramEngine,
  NodeModel,
  NodeModelGenerics,
  PortModelAlignment
} from '@projectstorm/react-diagrams'
import { PrimaryNodeModelGenerics } from './types'
import { PrimaryNodeWidget } from './widget'
import { PrimaryPortModel } from './primary-port'

// Модель
export class PrimaryNodeModel extends NodeModel<NodeModelGenerics & PrimaryNodeModelGenerics> {
  constructor() {
    super({
      type: 'diamond',
      width: 500,
      height: 200
    })
    this.addPort(new PrimaryPortModel(PortModelAlignment.TOP))
    this.addPort(new PrimaryPortModel(PortModelAlignment.LEFT))
    this.addPort(new PrimaryPortModel(PortModelAlignment.BOTTOM))
    this.addPort(new PrimaryPortModel(PortModelAlignment.RIGHT))
  }
}

// Фабрика
export class PrimaryNodeFactory extends AbstractReactFactory<PrimaryNodeModel, DiagramEngine> {
  constructor() {
    super('diamond')
  }

  generateReactWidget(event): JSX.Element {
    return <PrimaryNodeWidget engine={this.engine} node={event.model} />
  }

  generateModel() {
    return new PrimaryNodeModel()
  }
}
