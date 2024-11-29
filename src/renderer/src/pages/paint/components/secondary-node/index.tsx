import { AbstractReactFactory } from '@projectstorm/react-canvas-core'
import {
  DiagramEngine,
  NodeModel,
  NodeModelGenerics,
  PortModelAlignment
} from '@projectstorm/react-diagrams'
import { SecondaryNodeModelGenerics } from './types'
import { SecondaryNodeWidget } from './widget'
import { SecondaryPortModel } from './secondary-port'

// Модель
export class SecondaryNodeModel extends NodeModel<NodeModelGenerics & SecondaryNodeModelGenerics> {
  constructor() {
    super({
      type: 'secondary-node',
      width: 500,
      height: 200
    })
    // this.addPort(new SecondaryPortModel(PortModelAlignment.TOP))
    // this.addPort(new SecondaryPortModel(PortModelAlignment.LEFT))
    // this.addPort(new SecondaryPortModel(PortModelAlignment.BOTTOM))
    // this.addPort(new SecondaryPortModel(PortModelAlignment.RIGHT))
  }
}

// Фабрика
export class SecondaryNodeFactory extends AbstractReactFactory<SecondaryNodeModel, DiagramEngine> {
  constructor() {
    super('secondary-node')
  }

  generateReactWidget(event, parentPorts: object): JSX.Element {
    return <SecondaryNodeWidget engine={this.engine} node={event.model} parentPorts={parentPorts} />
  }

  // generateModel() {
  //   return new SecondaryNodeModel()
  // }
}
