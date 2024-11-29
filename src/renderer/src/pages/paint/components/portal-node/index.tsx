import { AbstractReactFactory } from '@projectstorm/react-canvas-core'
import { DiagramEngine, NodeModel, NodeModelGenerics } from '@projectstorm/react-diagrams'

import { PortalNodeWidget } from './widget'
import { PrimaryNodeModel } from '@renderer/pages/paint/components/primary-node'
import { PrimaryNodeModelGenerics } from '@renderer/pages/paint/components/primary-node/types'

// Модель
export class PortalNodeModel extends NodeModel<NodeModelGenerics & PrimaryNodeModelGenerics> {
  constructor() {
    super({
      type: 'portal'
    })
  }

  setNodeList(data) {
    this.data = data
  }

  generateReactWidget(event): JSX.Element {
    console.log(this.data, 'my data')
    return <div>1</div>
  }
}

// Фабрика
export class PortalNodeFactory extends AbstractReactFactory<PrimaryNodeModel, DiagramEngine> {
  constructor() {
    super('portal')
  }

  generateReactWidget(event): JSX.Element {
    console.log(this.generateModel())

    return <PortalNodeWidget engine={this.engine} node={event.model} />
  }

  generateModel() {
    return new PortalNodeModel()
  }
}
