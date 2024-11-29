import { useEffect, useState } from 'react'
import { DiagramEngine } from '@projectstorm/react-diagrams-core'
import createEngine, { DiagramModel, PortModelAlignment } from '@projectstorm/react-diagrams'
import { engineDefaultConfig } from '@renderer/pages/paint/const'
import {
  PrimaryPortFactory,
  PrimaryPortModel
} from '@renderer/pages/paint/components/primary-node/primary-port'
import { initCanvasData } from '@renderer/pages/paint/hooks/use-canvas/helpers/init-canvas-data'
import { registerCreateNodeByDbclick } from '@renderer/pages/paint/hooks/use-canvas/helpers/register-create-node-by-dbclick'
import { registerUpdateSaving } from '@renderer/pages/paint/hooks/use-canvas/helpers/register-update-saving'
import { PrimaryNodeFactory } from '@renderer/pages/paint/components/primary-node'
import { PrimaryLinkFactory } from '@renderer/pages/paint/components/primary-node/primary-port/primary-link'
import { fileSystemAdapter } from '@renderer/api/fileSystemAdapter'
import { ContainerNodeFactory } from '@renderer/pages/paint/components/container-node'
import {
  SecondaryPortFactory,
  SecondaryPortModel
} from '@renderer/pages/paint/components/secondary-node/secondary-port'
import { SecondaryNodeFactory } from '@renderer/pages/paint/components/secondary-node'

export const useCanvas = ({ selectedFile }: { selectedFile: string }) => {
  const [engineInstance, setEngineInstance] = useState<DiagramEngine>(null)
  const [diagramInstanceModel, setDiagramModelInstance] = useState<DiagramModel>(null)
  const isCanvasReadyToPaint = !!engineInstance && !!diagramInstanceModel

  useEffect(() => {
    const engine = createEngine(engineDefaultConfig)
    const diagramModel = new DiagramModel()

    engine
      .getPortFactories()
      .registerFactory(
        new PrimaryPortFactory('diamond', () => new PrimaryPortModel(PortModelAlignment.LEFT))
      )

    engine
      .getPortFactories()
      .registerFactory(
        new SecondaryPortFactory(
          'secondary-port',
          () => new SecondaryPortModel(PortModelAlignment.LEFT)
        )
      )

    engine.getLinkFactories().registerFactory(new PrimaryLinkFactory())
    engine.getNodeFactories().registerFactory(new PrimaryNodeFactory())
    engine.getNodeFactories().registerFactory(new ContainerNodeFactory())
    engine.getNodeFactories().registerFactory(new SecondaryNodeFactory())

    engine.setModel(diagramModel)

    setEngineInstance(engine)
    setDiagramModelInstance(diagramModel)

    const dbClickAction = registerCreateNodeByDbclick(diagramModel, engine)

    return () => {
      // Очищаем действие при размонтировании
      engine.getActionEventBus().deregisterAction(dbClickAction)
    }
  }, [])

  useEffect(() => {
    if (isCanvasReadyToPaint) {
      fileSystemAdapter.readFile(selectedFile).then((initData) => {
        initCanvasData(diagramInstanceModel, engineInstance, initData)
      })

      const savingListener = registerUpdateSaving(diagramInstanceModel, selectedFile)

      return () => {
        diagramInstanceModel.deregisterListener(savingListener)
      }
    }
  }, [diagramInstanceModel, engineInstance, selectedFile, isCanvasReadyToPaint])

  return { engine: engineInstance, model: diagramInstanceModel, isCanvasReadyToPaint }
}
