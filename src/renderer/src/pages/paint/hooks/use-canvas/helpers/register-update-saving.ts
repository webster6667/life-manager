import { DiagramModel } from '@projectstorm/react-diagrams'
import { fileSystemAdapter } from '@renderer/api/fileSystemAdapter'

export const registerUpdateSaving = (modelInstance: DiagramModel, filePath) => {
  const eventListener = modelInstance.registerListener({
    eventDidFire: () => {
      const serializedModel = modelInstance.serialize() // Сериализация модели
      fileSystemAdapter.updateFile(filePath, JSON.stringify(serializedModel))
    }
  })

  return eventListener
}
