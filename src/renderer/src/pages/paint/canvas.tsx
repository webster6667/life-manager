import { useCanvas } from '@renderer/pages/paint/hooks/use-canvas'
// import { CanvasWidget } from '@projectstorm/react-canvas-core'
import { CanvasWidget } from './canvas-widget'
import { CircularProgress } from '@mui/material'
import { CanvasWrapper } from '@renderer/pages/paint/components/ui/canvas-wrapper'
import React, { FC } from 'react'
import { fileSystemAdapter } from '@renderer/api/fileSystemAdapter'
import { PrimaryNodeFactory, PrimaryNodeModel } from '@renderer/pages/paint/components/primary-node'
import {
  PrimaryPortFactory,
  PrimaryPortModel
} from '@renderer/pages/paint/components/primary-node/primary-port'
import createEngine, {
  DefaultLinkModel,
  DiagramModel,
  PointModel,
  PortModelAlignment
} from '@projectstorm/react-diagrams'
import { engineDefaultConfig } from '@renderer/pages/paint/const'
import {
  PrimaryLinkFactory,
  PrimaryLinkModel
} from '@renderer/pages/paint/components/primary-node/primary-port/primary-link'
import { isEmpty } from 'lodash'
import {
  ContainerNodeFactory,
  ContainerNodeModel
} from '@renderer/pages/paint/components/container-node'
import { PortalNodeModel } from '@renderer/pages/paint/components/portal-node'

type PortAlignment = 'top' | 'left' | 'bottom' | 'right'

interface Link {
  id: string // Если нужны ID для связей
  sourcePort?: string // ID порта-источника
  targetPort?: string // ID порта-назначения
}

interface Port {
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
        port: Port
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

export const Canvas: FC<{ selectedFile: string }> = ({ selectedFile }) => {
  const { engine, model, isCanvasReadyToPaint } = useCanvas({ selectedFile })

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault() // Разрешаем сброс
  }

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault()
    // Получаем координаты клика на канвасе
    const mousePoint = engine.getRelativeMousePoint(event.nativeEvent as MouseEvent)
    const portalFilePath = event.dataTransfer.getData('text/plain')

    const fileData = (await fileSystemAdapter
      .readFile(portalFilePath)
      .then((res) => JSON.parse(res))) as canvasData
    const links = fileData.layers[0].models
    const nodes = fileData.layers[1].models

    // // Создаем новый узел с позиции клика
    const node = new ContainerNodeModel()
    //
    node.setPortalFilePath(portalFilePath)
    node.setPosition(mousePoint.x, mousePoint.y)
    //
    model.addNode(node)

    // console.log(fileData, 'test')
    //
    // console.log(nodes, 'test')

    // Object.values(nodes).forEach(({ id, type, port, x, y }) => {
    //   const node = new PrimaryNodeModel()
    //   node.setPosition(x, y)
    //
    //   model.addNode(node)
    // })
    //
    // Object.values(links).forEach(({ points }) => {
    //   const link = new DefaultLinkModel()
    //   points.forEach(({ x, y }) => {
    //     const pointModel = new PointModel({ link })
    //     pointModel.setPosition(x, y)
    //     link.addPoint(pointModel)
    //   })
    //
    //   model.addLink(link)
    // })

    // console.log(links, 'test')

    // const linkForCreate = Object.values(nodes).map(({ id, type, points, x, y }) => {
    //   const node = new PrimaryLinkModel()
    //   node.setPoints(points) // Устанавливаем позицию
    //
    //   return node
    // })

    // model.addNode(nodeForCreate[0])

    //
    // const newData = JSON.parse(JSON.stringify(model.serialize())) as canvasData
    //
    // Получаем координаты клика на канвасе
    // const mousePoint = engine.getRelativeMousePoint(event.nativeEvent as MouseEvent)
    //
    // // // Создаем новый узел с позиции клика
    // const node = new PortalNodeModel(fileData)
    //
    // // Устанавливаем позицию узла
    // node.setPosition(mousePoint.x, mousePoint.y)
    //
    // Добавляем узел в модель
    // model.addNode(node)
    //
    // console.log(model.getLayers(), newData, 'ts')

    const portalEngine = createEngine(engineDefaultConfig)
    const portalDiagramModel = new DiagramModel()

    portalEngine
      .getPortFactories()
      .registerFactory(
        new PrimaryPortFactory('diamond', () => new PrimaryPortModel(PortModelAlignment.LEFT))
      )
    portalEngine.getLinkFactories().registerFactory(new PrimaryLinkFactory())
    portalEngine.getNodeFactories().registerFactory(new PrimaryNodeFactory())
    // portalEngine.getNodeFactories().registerFactory(new ContainerNodeFactory())
    // portalEngine.getLayerFactories().registerFactory(new CustomLayerFactory())

    // portalEngine.getNodeFactories().registerFactory(new PortalFactory())

    // portalEngine.getLa

    // portalEngine.setModel(portalDiagramModel)
    //
    portalDiagramModel.deserializeModel(
      isEmpty(fileData) ? new DiagramModel().serialize() : fileData,
      portalEngine
    )
    //
    // const containerNode = new ContainerNodeModel()
    // containerNode.setPosition(100, 100) // Позиционируем контейнерную ноду
    //
    // model.addNode(containerNode)

    // const a = portalDiagramModel.getLayers()[0]
    // const b = portalDiagramModel.getLayers()[1]
    // // // const l = model.getLayers()[0]
    // //
    // model.addLayer(a)
    // model.addLayer(b)

    // Обновляем канвас
    engine.repaintCanvas()

    // model.deserializeModel(newData)
    // engine.repaintCanvas()
  }

  return (
    <CanvasWrapper style={{ width: '100%' }} onDragOver={handleDragOver} onDrop={handleDrop}>
      {isCanvasReadyToPaint ? <CanvasWidget engine={engine} /> : <CircularProgress />}
    </CanvasWrapper>
  )
}
