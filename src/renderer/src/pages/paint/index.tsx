import { useEffect, useState } from 'react'
import createEngine, {
  Action,
  ActionEvent,
  DefaultNodeModel,
  DiagramModel,
  InputType,
  PortModelAlignment
} from '@projectstorm/react-diagrams'
import { CanvasWidget } from '@projectstorm/react-canvas-core'

import {
  CanvasShapeLinkFactory,
  CanvasShapeModel,
  CanvasShapeNodeFactory,
  CanvasShapePortFactory
} from '@renderer/pages/paint/components/canvas-shape'
import { DiagramEngine } from '@projectstorm/react-diagrams-core'
import { CanvasWrapper } from '@renderer/pages/paint/components/ui/canvas-wrapper'
import { canvasId, engineDefaultConfig } from '@renderer/pages/paint/const'
import { Box, CircularProgress } from '@mui/material'
import { useDidMount } from '@common-hook'
import {
  PrimaryPortFactory,
  PrimaryPortModel
} from '@renderer/pages/paint/components/primary-node/primary-port'
import { initCanvasData } from '@renderer/pages/paint/hooks/use-canvas/helpers/init-canvas-data'
import { useCanvas } from '@renderer/pages/paint/hooks/use-canvas'

// const useCanvas = () => {
//   const [engineInstance, setEngineInstance] = useState<DiagramEngine>(null)
//   const [diagramInstanceModel, setDiagramModelInstance] = useState<DiagramModel>(null)
//   const isCanvasReadyToPaint = !!engineInstance && !!diagramInstanceModel
//
//   useDidMount(() => {
//     // Создаем движок и модель диаграммы
//     const engine = createEngine(engineDefaultConfig)
//     const diagramModel = new DiagramModel()
//
//     engine
//       .getPortFactories()
//       .registerFactory(
//         new PrimaryPortFactory('diamond', () => new PrimaryPortModel(PortModelAlignment.LEFT))
//       )
//     engine.getNodeFactories().registerFactory(new CanvasShapeNodeFactory())
//
//     engine.setModel(diagramModel)
//
//     setEngineInstance(engine)
//     setDiagramModelInstance(diagramModel)
//
//     initCanvasData(diagramModel, engine)
//   })
//
//   return { engine: engineInstance, diagramModel: diagramInstanceModel, isCanvasReadyToPaint }
// }

const DiagramWithNodes = () => {
  const { engine, model, isCanvasReadyToPaint } = useCanvas()
  // const [engine, setEngine] = useState<DiagramEngine>(null)
  // const [model, setModel] = useState<DiagramModel>(null)
  //
  // useEffect(() => {
  //   let lastClickTime = 0 // Переменная для времени последнего клика
  //
  //   // Создаем движок и модель
  //   const engineInstance = createEngine({
  //     registerDefaultZoomCanvasAction: false, // Отключаем дефолтное зумирование
  //     registerDefaultPanAndZoomCanvasAction: true // Включаем стандартное перемещение + зум
  //   })
  //   const modelInstance = new DiagramModel()
  //
  //   // register some other factories as well
  //   engineInstance.getLinkFactories().registerFactory(new CanvasShapeLinkFactory())
  //   engineInstance.getPortFactories().registerFactory(new CanvasShapePortFactory())
  //
  //   // .registerFactory(
  //   //   new SimplePortFactory('diamond', () => new CanvasShapePortModel(PortModelAlignment.LEFT))
  //   // )
  //   engineInstance.getNodeFactories().registerFactory(new CanvasShapeNodeFactory())
  //
  //   // Связываем модель с движком
  //   engineInstance.setModel(modelInstance)
  //
  //   // Загружаем сохранённое состояние
  //   const savedData = localStorage.getItem('st')
  //   if (savedData) {
  //     try {
  //       const jsonData = JSON.parse(savedData)
  //       modelInstance.deserializeModel(jsonData, engineInstance) // Десериализация модели
  //     } catch (error) {
  //       console.error('Error loading diagram state:', error)
  //     }
  //   }
  //
  //   // Обновляем состояние
  //   setEngine(engineInstance)
  //   setModel(modelInstance)
  //
  //   // Обработчик клика через eventBus для добавления узлов
  //   const handleCanvasClick = ({ event }: ActionEvent) => {
  //     const currentTime = Date.now()
  //
  //     if (currentTime - lastClickTime < 500) {
  //       // Получаем координаты клика на канвасе
  //       const mousePoint = engineInstance.getRelativeMousePoint(event.nativeEvent as MouseEvent)
  //
  //       // Создаем новый узел с позиции клика
  //       const node = new CanvasShapeModel()
  //
  //       // Устанавливаем позицию узла
  //       node.setPosition(mousePoint.x, mousePoint.y)
  //
  //       // Добавляем узел в модель
  //       modelInstance.addNode(node)
  //
  //       // Обновляем канвас
  //       engineInstance.repaintCanvas()
  //     }
  //
  //     lastClickTime = currentTime // Обновляем время последнего клика
  //   }
  //
  //   // Создаем действие для клика
  //   const clickAction = new Action({
  //     type: InputType.MOUSE_UP, // Используем тип события из InputType
  //     fire: handleCanvasClick // Ваш обработчик
  //   })
  //
  //   // Регистрируем действие
  //   engineInstance.getActionEventBus().registerAction(clickAction)
  //
  //   const eventListener = (event) => {
  //     const serializedModel = modelInstance.serialize() // Сериализация модели
  //     localStorage.setItem('st', JSON.stringify(serializedModel))
  //   }
  //
  //   // Регистрируем слушатель для событий модели
  //   modelInstance.registerListener({
  //     eventDidFire: eventListener
  //   })
  //
  //   return () => {
  //     // Очищаем действие при размонтировании
  //     engineInstance.getActionEventBus().deregisterAction(clickAction)
  //
  //     modelInstance.deregisterListener({
  //       eventDidFire: eventListener
  //     })
  //   }
  // }, [])
  //
  const addNode = () => {
    if (!model || !engine) return

    // setCount((prev) => prev + 1)

    const newNode = new DefaultNodeModel()
    const newNode1 = new DefaultNodeModel()

    // Устанавливаем позицию узла
    newNode.setPosition(Math.random() * 400 + 100, Math.random() * 300 + 100)
    newNode.addInPort('test1')

    newNode1.setPosition(Math.random() * 400 + 100, Math.random() * 300 + 100)
    newNode1.addOutPort('test2')

    // Добавляем узел в модель
    model.addNode(newNode)
    model.addNode(newNode1)

    // Перерисовываем канвас
    engine.repaintCanvas()
  }
  //
  // if (!engine) {
  //   return <div>Loading...</div>
  // }

  // return (
  //   <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
  //     <div style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
  //       <button onClick={addNode}>Add Node</button>
  //     </div>
  //     <Box
  //       id={'canvas'}
  //       sx={{
  //         position: 'relative',
  //         width: '100%',
  //         height: '100%',
  //         '& > div': {
  //           width: '100%',
  //           height: '100%'
  //         }
  //       }}
  //     >
  //       <CanvasWidget engine={engine} />
  //     </Box>
  //   </div>
  // )

  return (
    <CanvasWrapper id={canvasId}>
      <button onClick={addNode}>Add Node</button>
      {isCanvasReadyToPaint ? <CanvasWidget engine={engine} /> : <CircularProgress />}
    </CanvasWrapper>
  )
}

export default DiagramWithNodes
