import { useCallback, useEffect, useState, FC } from 'react'
import { createPortal } from 'react-dom'
import SettingsIcon from '@mui/icons-material/Settings'

import { Port, ResizeHandle } from './styles'

import { MarkdownEditor } from '@remirror/react-editors/markdown'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'

import {
  DefaultLinkModel,
  DiagramEngine,
  LinkModel,
  NodeModel,
  NodeModelGenerics,
  PortModel,
  PortModelAlignment,
  PortWidget,
  DefaultLinkWidget,
  DefaultLinkFactory
} from '@projectstorm/react-diagrams'

import { AbstractModelFactory, AbstractReactFactory } from '@projectstorm/react-canvas-core'
import { Box, List, ListItemButton, Stack, Tab, Tabs } from '@mui/material'
import {
  CanvasShapeModelGenerics,
  CanvasShapeWidgetProps
} from '@renderer/pages/paint/components/canvas-shape/types'

import CircleIcon from '@mui/icons-material/Circle'

const shapeNavList = [
  {
    label: 'Фигура',
    value: 'shape',
    navItems: [
      { label: 'Прямоугольник', value: 'rectangle' },
      { label: 'Алмаз', value: 'diamond' },
      { label: 'Овал', value: 'oval' }
    ]
  },
  {
    label: 'Цвет',
    value: 'color',
    navItems: [
      { label: 'Сизый', value: '#53dfdd' },
      { label: 'Красный', value: 'red' },
      { label: 'Зеленый', value: 'green' },
      { label: 'Оранжевый', value: 'orange' },
      { label: 'Серый', value: 'silver' }
    ]
  },
  {
    label: 'Обводка',
    value: 'border',
    navItems: [
      { label: 'solid', value: 'solid' },
      { label: 'border', value: 'dash' }
    ]
  }
]

export const CanvasShapeWidget: FC<CanvasShapeWidgetProps> = ({ size, engine, node }) => {
  const [isResizing, setIsResizing] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [originalWidth, setOriginalWidth] = useState(node.options.width || 100)
  const [originalHeight, setOriginalHeight] = useState(node.options.height || 100)

  const [shapeNavValue, setShapeNavValue] = useState()
  const [shapeOptions, setShapeOptions] = useState({
    shape: 'rectangle',
    color: 'silver',
    border: 'solid'
  })

  const navItemClickHandler = (value) => {
    setShapeOptions((prev) => {
      const newOpts = { ...prev }

      newOpts[shapeNavValue] = value

      return newOpts
    })
  }

  const handleResizeStart = useCallback((e) => {
    setIsResizing(true)
    setStartX(e.clientX)
    setStartY(e.clientY)
    setOriginalWidth(node.options.width || 100)
    setOriginalHeight(node.options.height || 100)
    e.stopPropagation()
  }, [])

  const handleResize = useCallback(
    (e) => {
      if (isResizing) {
        const deltaX = e.clientX - startX
        const deltaY = e.clientY - startY

        node.options.width = Math.max(50, originalWidth + deltaX) // Обновляем ширину
        node.options.height = Math.max(50, originalHeight + deltaY)

        setOriginalWidth(Math.max(50, originalWidth + deltaX))
        setOriginalHeight(Math.max(50, originalHeight + deltaY))
      }
    },
    [isResizing, node]
  )

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false)
    document.body.style.userSelect = '' // Восстанавливаем выделение текста
  }, [])

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResize)
      window.addEventListener('mouseup', handleResizeEnd)
    } else {
      window.removeEventListener('mousemove', handleResize)
      window.removeEventListener('mouseup', handleResizeEnd)
    }
    return () => {
      window.removeEventListener('mousemove', handleResize)
      window.removeEventListener('mouseup', handleResizeEnd)
    }
  }, [isResizing, handleResize, handleResizeEnd])

  return (
    <Box
      sx={{
        position: 'relative'
      }}
    >
      {node.isSelected() && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0
          }}
        >
          <Tabs value={shapeNavValue} onChange={(_, value) => setShapeNavValue(value)}>
            {shapeNavList.map(({ value, label }) => (
              <Tab value={value} label={label} key={value} />
            ))}
          </Tabs>

          {shapeNavValue && (
            <List>
              {shapeNavList
                .find(({ value }) => value == shapeNavValue)
                ['navItems'].map(({ label, value }) => (
                  <ListItemButton key={value} onClick={() => navItemClickHandler(value)}>
                    {label}
                  </ListItemButton>
                ))}
            </List>
          )}
        </Box>
      )}

      <div
        style={{
          width: originalWidth,
          height: originalHeight,
          border: `1px solid ${node.isSelected() ? 'red' : 'silver'}`,
          borderRadius: shapeOptions.shape === 'oval' ? '1000px' : '6px',
          backgroundColor: shapeOptions.color
        }}
      >
        <MarkdownEditor />
      </div>
      <PortWidget
        style={{
          position: 'absolute',
          top: originalHeight / 2 - 8,
          left: -8
        }}
        port={node.getPort(PortModelAlignment.LEFT)}
        engine={engine}
      >
        <Port />
      </PortWidget>
      <PortWidget
        style={{
          position: 'absolute',
          left: originalWidth / 2 - 8,
          top: -8
        }}
        port={node.getPort(PortModelAlignment.TOP)}
        engine={engine}
      >
        <Port />
      </PortWidget>
      <PortWidget
        style={{
          position: 'absolute',
          left: originalWidth - 8,
          top: originalHeight / 2 - 8
        }}
        port={node.getPort(PortModelAlignment.RIGHT)}
        engine={engine}
      >
        <Port />
      </PortWidget>
      <PortWidget
        style={{
          position: 'absolute',
          left: originalWidth / 2 - 8,
          top: originalHeight - 8
        }}
        port={node.getPort(PortModelAlignment.BOTTOM)}
        engine={engine}
      >
        <Port />
      </PortWidget>
      <ResizeHandle onMouseDown={handleResizeStart} />
    </Box>
  )
}

export class CanvasShapePortModel extends PortModel {
  constructor(alignment: PortModelAlignment) {
    super({
      type: 'diamond-port',
      name: alignment,
      alignment: alignment
    })
  }

  createLinkModel(): LinkModel {
    return new CustomLinkModel()
  }
}

export class CanvasShapePortFactory extends AbstractModelFactory<
  CanvasShapePortModel,
  DiagramEngine
> {
  constructor() {
    super('diamond-port')
  }

  generateModel() {
    return new CanvasShapePortModel()
  }
}

export class CanvasShapeModel extends NodeModel<NodeModelGenerics & CanvasShapeModelGenerics> {
  constructor() {
    super({
      type: 'diamond',
      width: 500,
      height: 200
    })
    this.addPort(new CanvasShapePortModel(PortModelAlignment.TOP))
    this.addPort(new CanvasShapePortModel(PortModelAlignment.LEFT))
    this.addPort(new CanvasShapePortModel(PortModelAlignment.BOTTOM))
    this.addPort(new CanvasShapePortModel(PortModelAlignment.RIGHT))
  }
}

export class CanvasShapeNodeFactory extends AbstractReactFactory<CanvasShapeModel, DiagramEngine> {
  constructor() {
    super('diamond')
  }

  generateReactWidget(event): JSX.Element {
    return <CanvasShapeWidget engine={this.engine} size={400} node={event.model} />
  }

  generateModel() {
    return new CanvasShapeModel()
  }
}

const colors = ['blue', 'black', 'red']

const Modal = ({ onColorChange, deleteLink, ...props }) => {
  return createPortal(
    <Box {...props}>
      <Stack flexDirection="row">
        {colors.map((color) => (
          <CircleIcon
            style={{ color: color }}
            width={10}
            height={10}
            key={color}
            onClick={() => onColorChange(color)}
          />
        ))}
        <HighlightOffIcon width={10} height={10} onClick={deleteLink} />
      </Stack>
    </Box>,
    document.getElementById('canvas').firstElementChild.lastElementChild
  )
}

export const CustomLinkWidget = (props) => {
  // const { link } = props
  const link = props?.link as CustomLinkModel
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setClicked] = useState(false)

  const onColorChange = (color) => {
    link.setColor(color)
    props.diagramEngine.repaintCanvas() // Перерисовка диаграммы
  }

  // Удаление связи
  const deleteLink = () => {
    const diagramModel = props.diagramEngine.getModel() // Получаем модель диаграммы
    if (diagramModel) {
      diagramModel.removeLink(props.link) // Удаляем связь
      props.diagramEngine.repaintCanvas() // Перерисовываем канвас
    }
  }

  return (
    <g
      onMouseUp={() => {
        if (!link.getTargetPort()) {
          const sourcePortAlignment = link.sourcePort.options.alignment
          // console.log(link, link.sourcePort.options.alignment, 'test')

          const mirroMap = {
            [PortModelAlignment.BOTTOM]: PortModelAlignment.TOP,
            [PortModelAlignment.TOP]: PortModelAlignment.BOTTOM,
            [PortModelAlignment.LEFT]: PortModelAlignment.RIGHT,
            [PortModelAlignment.RIGHT]: PortModelAlignment.LEFT
          }

          // Получаем позицию последней точки линка
          const lastPoint = link.getLastPoint()
          const { x, y } = lastPoint.getPosition()

          // Создаем новую Node
          const newNode = new CanvasShapeModel()

          // Устанавливаем позицию новой Node в месте конечной точки линка
          newNode.setPosition(x - 250, y)

          // Добавляем новый выходной порт к Node
          const newPort = newNode.getPort(mirroMap[sourcePortAlignment])

          // Привязываем конечную точку линка к новому порту
          link.setTargetPort(newPort)

          // Добавляем Node в модель диаграммы
          const model = props.diagramEngine.getModel()
          model.addNode(newNode)

          // Перерисовываем холст
          props.diagramEngine.repaintCanvas()
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
        <Modal
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

export class CustomLinkModel extends DefaultLinkModel {
  constructor() {
    super({
      type: 'custom-link'
    })
  }

  setColor(color: string) {
    this.options.color = color
    this.fireEvent({ color }, 'colorChanged')
  }

  serialize() {
    return {
      ...super.serialize()
    }
  }

  deserialize(event) {
    super.deserialize(event)
  }

  getMiddlePoint() {
    const points = this.getPoints()
    if (points.length < 2) return { x: 0, y: 0 }
    const midIndex = Math.floor(points.length / 2) - 1
    const start = points[midIndex].getPosition()
    const end = points[midIndex + 1].getPosition()
    return {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2
    }
  }
}

export class CanvasShapeLinkFactory extends DefaultLinkFactory {
  constructor() {
    super('custom-link')
  }

  generateReactWidget(event): JSX.Element {
    return <CustomLinkWidget link={event.model} diagramEngine={this.engine} />
  }

  generateModel() {
    return new CustomLinkModel()
  }
}
