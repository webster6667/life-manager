import { useLayoutEffect, useState } from 'react'
import { DiagramEngine } from '@projectstorm/react-diagrams-core'
import createEngine, { DiagramModel, PortModelAlignment } from '@projectstorm/react-diagrams'
import { useDidMount } from '@common-hook'
import { engineDefaultConfig } from '@renderer/pages/paint/const'
import {
  PrimaryPortFactory,
  PrimaryPortModel
} from '@renderer/pages/paint/components/primary-node/primary-port'
import { CanvasShapeNodeFactory } from '@renderer/pages/paint/components/canvas-shape'
import { initCanvasData } from '@renderer/pages/paint/hooks/use-canvas/helpers/init-canvas-data'
import { registerCreateNodeByDbclick } from '@renderer/pages/paint/hooks/use-canvas/helpers/register-create-node-by-dbclick'
import { registerUpdateSaving } from '@renderer/pages/paint/hooks/use-canvas/helpers/register-update-saving'
import { PrimaryNodeFactory } from '@renderer/pages/paint/components/primary-node'
import { PrimaryLinkFactory } from '@renderer/pages/paint/components/primary-node/primary-port/primary-link'

export const useCanvas = () => {
  const [engineInstance, setEngineInstance] = useState<DiagramEngine>(null)
  const [diagramInstanceModel, setDiagramModelInstance] = useState<DiagramModel>(null)
  const isCanvasReadyToPaint = !!engineInstance && !!diagramInstanceModel

  useLayoutEffect(() => {
    // Создаем движок и модель диаграммы
    const engine = createEngine(engineDefaultConfig)
    const diagramModel = new DiagramModel()

    engine
      .getPortFactories()
      .registerFactory(
        new PrimaryPortFactory('diamond', () => new PrimaryPortModel(PortModelAlignment.LEFT))
      )
    engine.getLinkFactories().registerFactory(new PrimaryLinkFactory())
    engine.getNodeFactories().registerFactory(new PrimaryNodeFactory())

    engine.setModel(diagramModel)

    setEngineInstance(engine)
    setDiagramModelInstance(diagramModel)

    initCanvasData(diagramModel, engine)

    const dbClickAction = registerCreateNodeByDbclick(diagramModel, engine)
    const savingListener = registerUpdateSaving(diagramModel)

    return () => {
      // Очищаем действие при размонтировании
      engine.getActionEventBus().deregisterAction(dbClickAction)

      diagramModel.deregisterListener({
        eventDidFire: savingListener
      })
    }
  }, [])

  return { engine: engineInstance, model: diagramInstanceModel, isCanvasReadyToPaint }
}
