import { Action, ActionEvent, DiagramModel, InputType } from '@projectstorm/react-diagrams'
import { DiagramEngine } from '@projectstorm/react-diagrams-core'
import { PrimaryNodeModel } from '@renderer/pages/paint/components/primary-node'

export const registerCreateNodeByDbclick = (
  modelInstance: DiagramModel,
  engineInstance: DiagramEngine
) => {
  let lastClickTime = 0 // Переменная для времени последнего клика

  // Обработчик клика через eventBus для добавления узлов
  const handleCanvasClick = ({ event }: ActionEvent) => {
    const currentTime = Date.now()

    if (currentTime - lastClickTime < 500) {
      // Получаем координаты клика на канвасе
      const mousePoint = engineInstance.getRelativeMousePoint(event.nativeEvent as MouseEvent)

      // Создаем новый узел с позиции клика
      const node = new PrimaryNodeModel()

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

  return clickAction
}
