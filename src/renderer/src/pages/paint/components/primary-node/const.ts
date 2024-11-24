import { PortModelAlignment } from '@projectstorm/react-diagrams'

export const navigationList = [
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
] as const

export const ports = Object.values(PortModelAlignment)
export const portStyles = (originalWidth: number, originalHeight: number) => ({
  left: {
    position: 'absolute',
    top: originalHeight / 2 - 8,
    left: -8
  },
  top: {
    position: 'absolute',
    left: originalWidth / 2 - 8,
    top: -8
  },
  bottom: {
    position: 'absolute',
    left: originalWidth - 8,
    top: originalHeight / 2 - 8
  },
  right: {
    position: 'absolute',
    left: originalWidth / 2 - 8,
    top: originalHeight - 8
  }
})
