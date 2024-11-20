import { useEffect, useState } from 'react'
import createEngine, { DiagramModel } from '@projectstorm/react-diagrams'
import { CanvasWidget } from '@projectstorm/react-canvas-core'
import { Box } from '@mui/material'

import {
  CanvasShapeModel,
  CanvasShapeNodeFactory
} from '@renderer/pages/paint/components/canvas-shape'

const DiagramWithNodes = () => {
  const [engine, setEngine] = useState<any | null>(null)
  const [model, setModel] = useState<any | null>(null)

  useEffect(() => {
    // Создаем движок и модель
    const engineInstance = createEngine()
    const modelInstance = new DiagramModel()

    // register some other factories as well
    // engineInstance.getLinkFactories().registerFactory(new AdvancedLinkFactory())

    // .registerFactory(
    //   new SimplePortFactory('diamond', () => new CanvasShapePortModel(PortModelAlignment.LEFT))
    // )
    engineInstance.getNodeFactories().registerFactory(new CanvasShapeNodeFactory())

    // Связываем модель с движком
    engineInstance.setModel(modelInstance)

    // Обновляем состояние
    setEngine(engineInstance)
    setModel(modelInstance)
  }, [])

  const addNode = () => {
    if (!model || !engine) return

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
        sx={{
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
