import { useEffect, useState, useRef } from 'react'
import createEngine, {
  Action,
  ActionEvent,
  DiagramModel,
  InputType
} from '@projectstorm/react-diagrams'
import { CanvasWidget } from '@projectstorm/react-canvas-core'
import { Box } from '@mui/material'

import {
  CanvasShapeLinkFactory,
  CanvasShapeModel,
  CanvasShapeNodeFactory,
  CanvasShapePortFactory
} from '@renderer/pages/paint/components/canvas-shape'

const DiagramWithNodes = () => {
  const [engine, setEngine] = useState<any | null>(null)
  const [model, setModel] = useState<any | null>(null)
  const canvasRef = useRef(null)
  const [count, setCount] = useState(1)

  useEffect(() => {
    let lastClickTime = 0 // Переменная для времени последнего клика

    // Создаем движок и модель
    const engineInstance = createEngine({
      registerDefaultZoomCanvasAction: false, // Отключаем дефолтное зумирование
      registerDefaultPanAndZoomCanvasAction: true // Включаем стандартное перемещение + зум
    })
    const modelInstance = new DiagramModel()

    // register some other factories as well
    engineInstance.getLinkFactories().registerFactory(new CanvasShapeLinkFactory())
    engineInstance.getPortFactories().registerFactory(new CanvasShapePortFactory())

    // .registerFactory(
    //   new SimplePortFactory('diamond', () => new CanvasShapePortModel(PortModelAlignment.LEFT))
    // )
    engineInstance.getNodeFactories().registerFactory(new CanvasShapeNodeFactory())

    // Связываем модель с движком
    engineInstance.setModel(modelInstance)

    // Загружаем сохранённое состояние
    const savedData = localStorage.getItem('st')
    if (savedData) {
      try {
        const jsonData = JSON.parse(savedData)
        modelInstance.deserializeModel(jsonData, engineInstance) // Десериализация модели
      } catch (error) {
        console.error('Error loading diagram state:', error)
      }
    }

    // Обновляем состояние
    setEngine(engineInstance)
    setModel(modelInstance)

    // Обработчик клика через eventBus для добавления узлов
    const handleCanvasClick = ({ event }: ActionEvent) => {
      const currentTime = Date.now()

      if (currentTime - lastClickTime < 500) {
        // Получаем координаты клика на канвасе
        const mousePoint = engineInstance.getRelativeMousePoint(event.nativeEvent as MouseEvent)

        // Создаем новый узел с позиции клика
        const node = new CanvasShapeModel()

        // Устанавливаем позицию узла
        node.setPosition(mousePoint.x, mousePoint.y)

        // Добавляем узел в модель
        modelInstance.addNode(node)

        // Обновляем канвас
        engineInstance.repaintCanvas()
      }

      lastClickTime = currentTime // Обновляем время последнего клика
    }

    // Создаем действие для клика
    const clickAction = new Action({
      type: InputType.MOUSE_UP, // Используем тип события из InputType
      fire: handleCanvasClick // Ваш обработчик
    })

    // Регистрируем действие
    engineInstance.getActionEventBus().registerAction(clickAction)

    const eventListener = (event) => {
      const serializedModel = modelInstance.serialize() // Сериализация модели
      localStorage.setItem('st', JSON.stringify(serializedModel))
    }

    // Регистрируем слушатель для событий модели
    modelInstance.registerListener({
      eventDidFire: eventListener
    })

    return () => {
      // Очищаем действие при размонтировании
      engineInstance.getActionEventBus().deregisterAction(clickAction)

      modelInstance.deregisterListener({
        eventDidFire: eventListener
      })
    }
  }, [])

  const addNode = () => {
    if (!model || !engine) return

    setCount((prev) => prev + 1)

    const newNode = new CanvasShapeModel()

    // Устанавливаем позицию узла
    newNode.setPosition(Math.random() * 400 + 100, Math.random() * 300 + 100)

    // Добавляем узел в модель
    model.addNode(newNode)

    // Перерисовываем канвас
    engine.repaintCanvas()
  }

  if (!engine) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
        <button onClick={addNode}>Add Node</button>
      </div>
      <Box
        id={'canvas'}
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          '& > div': {
            width: '100%',
            height: '100%'
          }
        }}
      >
        <CanvasWidget engine={engine} />
      </Box>
    </div>
  )
}

export default DiagramWithNodes
