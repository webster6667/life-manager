import { FC, useState } from 'react'

import { NodeModel } from '@projectstorm/react-diagrams-core'
import { DiagramEngine, PortModelAlignment, PortWidget } from '@projectstorm/react-diagrams'
import { AbstractReactFactory } from '@projectstorm/react-canvas-core'
import { fileSystemAdapter } from '@renderer/api/fileSystemAdapter'
import { useDidMount } from '@common-hook'
import { SecondaryNodeModel } from '@renderer/pages/paint/components/secondary-node'
import { PrimaryPortModel } from '@renderer/pages/paint/components/primary-node/primary-port'
import { Port } from '@renderer/pages/paint/components/secondary-node/styles'
import { SecondaryPortModel } from '@renderer/pages/paint/components/secondary-node/secondary-port'

type PortAlignment = 'top' | 'left' | 'bottom' | 'right'

interface Link {
  id: string // Если нужны ID для связей
  sourcePort?: string // ID порта-источника
  targetPort?: string // ID порта-назначения
}

interface ContainerNodeWidgetProps {
  node: ContainerNodeModel
  engine: DiagramEngine // Исправлено
}

interface PortProps {
  id: string
  type: string // Например, "diamond", но можно расширить
  x: number
  y: number
  name: string
  alignment: PortAlignment
  parentNode: string
  links: Link[] // Связи, пустой массив в примере
}

interface Point {
  id: string
  type: 'point' // Ограничение на значение "point"
  x: number // Координата по оси X
  y: number // Координата по оси Y
}

interface NodeProps {
  type: string
  selected: boolean
  extras: any
  id: string
  locked: boolean
  ports: PortProps[]
  points: Point[]
  x: number
  y: number
}

type canvasData = {
  offsetX: number
  offsetY: number
  zoom: number
  gridSize: number
  layers: {
    isSvg: boolean
    transformed: boolean
    models: {
      [x: string]: {
        type: string
        selected: boolean
        extras: any
        id: string
        locked: boolean
        port: PortProps
        points: Point[]
        x: number
        y: number
      }
    }
    type: string
    selected: boolean
    extras: any
    id: string
    locked: boolean
  }[]
  id: string
  locked: boolean
}

export const ContainerNodeWidget: FC<ContainerNodeWidgetProps> = ({ node, engine }) => {
  // const diagramModel = engine.getModel()
  // const test = diagramModel.getNodes()
  //
  // console.log(test, 'tes')

  const [nodes, setNodes] = useState([])

  useDidMount(async () => {
    const fileData = (await fileSystemAdapter
      .readFile(node.portalFilePath)
      .then((res) => JSON.parse(res))) as canvasData
    const links = fileData.layers[0].models
    const nodes = fileData.layers[1].models

    console.log(nodes, 'ports')
    // {
    //   "id": "b7d9cf1c-5d2e-4b52-829f-478a1ecb7c42",
    //   "type": "diamond",
    //   "x": 1285.1405411998953,
    //   "y": -169.56249011224924,
    //   "name": "left",
    //   "alignment": "left",
    //   "parentNode": "66296eb3-3ee7-450b-a377-c696da6fabcf",
    //   "links": [
    //   "ac1c1671-6999-4e2f-b94a-6d4f99871455"
    // ]
    // }

    // node.addPort(new SecondaryPortModel(PortModelAlignment.TOP, `${PortModelAlignment.TOP}`))
    //
    Object.values(nodes).forEach(({ id, ports }) => {
      ports.forEach(({ name }) => {
        const portName = `${id}_${name}`
        node.addPort(new SecondaryPortModel(name, portName))
      })
    })

    setNodes(Object.values(nodes))
  })

  return (
    <div className="container-node-widget">
      {/*<h3>Container Node</h3>*/}
      <div
        className="nested-nodes"
        style={{ position: 'relative', width: '800px', height: '800px' }}
      >
        {/*{engine.getNodeFactories().getFactory(n.getType())}*/}

        {nodes.length &&
          nodes.map(({ id, x, y, ports }: NodeProps, index) => {
            const childrenNode = new SecondaryNodeModel()

            const portsList = Object.values(node.getPorts()).filter((item) => {
              return item.options.name.startsWith(id)
            })

            return (
              <div key={index} style={{ position: 'absolute', left: x, top: y }}>
                {engine
                  .getNodeFactories()
                  .getFactory('secondary-node')
                  .generateReactWidget({ model: childrenNode }, portsList)}
              </div>
            )
          })}

        {/*{Object.values(node.getPorts()).map((port, index) => (*/}
        {/*  <PortWidget*/}
        {/*    style={{ position: 'absolute', top: 20, left: 10 }}*/}
        {/*    port={port}*/}
        {/*    engine={engine}*/}
        {/*    key={port.getID()}*/}
        {/*  >*/}
        {/*    <Port />*/}
        {/*  </PortWidget>*/}
        {/*))}*/}

        {/*{nodes.map((n) => {*/}
        {/*  const factory = engine.getNodeFactories().getFactory(n.getType())*/}
        {/*  return (*/}
        {/*    <div key={n.getID()} style={{ position: 'absolute', left: n.getX(), top: n.getY() }}>*/}
        {/*      {factory.generateReactWidget({ model: n })}*/}
        {/*    </div>*/}
        {/*  )*/}
        {/*})}*/}
      </div>
    </div>
  )
}

export class ContainerNodeModel extends NodeModel {
  portalFilePath: string // Новое свойство модели

  constructor() {
    super({
      type: 'container-node'
    })
  }

  setPortalFilePath(portalFilePath: string) {
    this.portalFilePath = portalFilePath
  }

  serialize() {
    const serialized = super.serialize() // Вызов базовой сериализации
    serialized.portalFilePath = this.portalFilePath // Пример добавления кастомного поля

    return serialized
  }

  // Десериализация
  deserialize(event: any): void {
    super.deserialize(event) // Вызов базовой десериализации
    this.portalFilePath = event.data.portalFilePath || '' // Десериализация кастомного свойства
  }
}

export class ContainerNodeFactory extends AbstractReactFactory<ContainerNodeModel, DiagramEngine> {
  constructor() {
    super('container-node')
  }

  generateModel(): ContainerNodeModel {
    return new ContainerNodeModel()
  }

  generateReactWidget(event: { model: ContainerNodeModel }) {
    return <ContainerNodeWidget node={event.model} engine={this.engine as DiagramEngine} />
  }
}
