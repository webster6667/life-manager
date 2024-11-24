import {
  DefaultLinkFactory,
  DefaultLinkModel,
  DefaultLinkModelOptions
} from '@projectstorm/react-diagrams'

import { PrimaryLinkWidget } from './widget'

// Модель
export class PrimaryLinkModel extends DefaultLinkModel {
  constructor(options: DefaultLinkModelOptions = {}) {
    super({ ...options, type: 'diamond' })
  }

  setColor(color: string) {
    this.options.color = color
    this.fireEvent({ color }, 'colorChanged')
  }

  getMiddlePoint() {
    const points = this.getPoints()
    if (points.length < 2) return { x: 0, y: 0 }
    const midIndex = Math.floor(points.length / 2) - 1
    const start = points[midIndex].getPosition()
    const end = points[midIndex + 1].getPosition()
    return {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2
    }
  }
}

//Фабрика
export class PrimaryLinkFactory extends DefaultLinkFactory {
  constructor() {
    super('diamond')
  }

  generateReactWidget(event): JSX.Element {
    return <PrimaryLinkWidget link={event.model} diagramEngine={this.engine} />
  }

  generateModel() {
    return new PrimaryLinkModel()
  }
}
