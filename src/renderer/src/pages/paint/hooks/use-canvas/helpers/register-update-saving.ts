import { DiagramModel } from '@projectstorm/react-diagrams'

export const registerUpdateSaving = (modelInstance: DiagramModel) => {
  const eventListener = () => {
    const serializedModel = modelInstance.serialize() // Сериализация модели
    localStorage.setItem('st', JSON.stringify(serializedModel))
  }

  // Регистрируем слушатель для событий модели
  modelInstance.registerListener({
    eventDidFire: eventListener
  })

  return eventListener
}
