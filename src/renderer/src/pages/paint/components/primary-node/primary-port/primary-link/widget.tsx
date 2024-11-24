import { FC, useState } from 'react'
import {
  DefaultLinkProps,
  DefaultLinkWidget,
  PortModelAlignment
} from '@projectstorm/react-diagrams'
import SettingsIcon from '@mui/icons-material/Settings'

import { portMirrorMap } from '@renderer/pages/paint/components/primary-node/primary-port/primary-link/const'
import { PrimaryLinkSettingsPortal } from '@renderer/pages/paint/components/primary-node/primary-port/primary-link/components/primary-link-settings'
import { PrimaryNodeModel } from '@renderer/pages/paint/components/primary-node'

export const PrimaryLinkWidget: FC<DefaultLinkProps> = (props) => {
  const { link, diagramEngine } = props
  const [isClicked, setClicked] = useState(false)

  const onColorChange = (color) => {
    link.setColor(color)
    diagramEngine.repaintCanvas()
  }

  // Удаление связи
  const deleteLink = () => {
    const diagramModel = diagramEngine.getModel()
    if (diagramModel) {
      diagramModel.removeLink(link)
      diagramEngine.repaintCanvas()
    }
  }

  return (
    <g
      onMouseUp={() => {
        if (!link.getTargetPort()) {
          const sourcePortAlignment = link.sourcePort.options.alignment

          // Получаем позицию последней точки линка
          const lastPoint = link.getLastPoint()
          const { x, y } = lastPoint.getPosition()

          // Создаем новую Node
          const newNode = new PrimaryNodeModel()

          // Устанавливаем позицию новой Node в месте конечной точки линка
          newNode.setPosition(x - 250, y)

          // Добавляем новый выходной порт к Node
          const newPort = newNode.getPort(portMirrorMap[sourcePortAlignment])

          // Привязываем конечную точку линка к новому порту
          link.setTargetPort(newPort)

          // Добавляем Node в модель диаграммы
          const model = diagramEngine.getModel()
          model.addNode(newNode)

          // Перерисовываем холст
          diagramEngine.repaintCanvas()
        }
      }}
    >
      <SettingsIcon
        width="100px"
        height="100px"
        sx={{
          pointerEvents: 'all'
        }}
        x={link.getMiddlePoint().x - 50}
        y={link.getMiddlePoint().y}
        onClick={() => {
          setClicked(true)
        }}
      />

      {isClicked && (
        <PrimaryLinkSettingsPortal
          style={{
            left: `${link.getMiddlePoint().x}px`,
            top: `${link.getMiddlePoint().y + 10}px`,
            position: 'absolute',
            width: '40px',
            height: '20px',
            pointerEvents: 'all'
          }}
          onColorChange={onColorChange}
          deleteLink={deleteLink}
        />
      )}
      <DefaultLinkWidget {...props} />
    </g>
  )
}
