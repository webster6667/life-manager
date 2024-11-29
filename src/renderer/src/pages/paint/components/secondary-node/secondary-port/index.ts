import {
  DefaultLinkModel,
  LinkModel,
  PortModel,
  PortModelAlignment
} from '@projectstorm/react-diagrams'
import { AbstractModelFactory } from '@projectstorm/react-canvas-core'
import { DiagramEngine } from '@projectstorm/react-diagrams-core'

export class SecondaryPortModel extends PortModel {
  constructor(alignment: PortModelAlignment, name) {
    super({
      type: 'secondary-port',
      name: name,
      alignment: alignment
    })
  }

  createLinkModel(): LinkModel {
    return new DefaultLinkModel()
  }
}

export class SecondaryPortFactory extends AbstractModelFactory<SecondaryPortModel, DiagramEngine> {
  cb: (initialConfig?: any) => SecondaryPortModel

  constructor(type: string, cb: (initialConfig?: any) => SecondaryPortModel) {
    super(type)
    this.cb = cb
  }

  generateModel(event): SecondaryPortModel {
    return this.cb(event.initialConfig)
  }
}
