import { LinkModel, PortModel, PortModelAlignment } from '@projectstorm/react-diagrams'
import { PrimaryLinkModel } from './primary-link/index'
import { AbstractModelFactory } from '@projectstorm/react-canvas-core'
import { DiagramEngine } from '@projectstorm/react-diagrams-core'

export class PrimaryPortModel extends PortModel {
  constructor(alignment: PortModelAlignment) {
    super({
      type: 'diamond',
      name: alignment,
      alignment: alignment
    })
  }

  createLinkModel(): LinkModel {
    return new PrimaryLinkModel()
  }
}

export class PrimaryPortFactory extends AbstractModelFactory<PrimaryPortModel, DiagramEngine> {
  cb: (initialConfig?: any) => PrimaryPortModel

  constructor(type: string, cb: (initialConfig?: any) => PrimaryPortModel) {
    super(type)
    this.cb = cb
  }

  generateModel(event): PrimaryPortModel {
    return this.cb(event.initialConfig)
  }
}
