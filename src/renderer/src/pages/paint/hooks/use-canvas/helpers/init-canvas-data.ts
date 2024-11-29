import { DiagramModel } from '@projectstorm/react-diagrams'
import { DiagramEngine } from '@projectstorm/react-diagrams-core'
import { isEmpty } from 'lodash'

export const initCanvasData = (
  modelInstance: DiagramModel,
  engineInstance: DiagramEngine,
  initData: string
) => {
  if (initData) {
    try {
      const jsonData = JSON.parse(initData)

      // console.log(jsonData, 'abcd')

      modelInstance.deserializeModel(
        isEmpty(jsonData) ? new DiagramModel().serialize() : jsonData,
        engineInstance
      )

      engineInstance.repaintCanvas()
    } catch (error) {
      console.error('Error loading diagram state:', error)
    }
  }
}
