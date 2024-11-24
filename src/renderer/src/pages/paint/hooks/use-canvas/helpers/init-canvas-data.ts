import { DiagramModel } from '@projectstorm/react-diagrams'
import { DiagramEngine } from '@projectstorm/react-diagrams-core'

export const initCanvasData = (modelInstance: DiagramModel, engineInstance: DiagramEngine) => {
  const savedData = localStorage.getItem('st')
  if (savedData) {
    try {
      const jsonData = JSON.parse(savedData)
      modelInstance.deserializeModel(jsonData, engineInstance) // Десериализация модели
    } catch (error) {
      console.error('Error loading diagram state:', error)
    }
  }
}
