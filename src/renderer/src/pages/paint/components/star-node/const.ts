export const shapeList = {
  label: 'Фигура',
  value: 'shape',
  navItems: [
    { label: 'Прямоугольник', value: 'rectangle' },
    { label: 'Парралелограм', value: 'parallelogram' },
    { label: 'Ромб', value: 'rhomb' },
    { label: 'Капсула', value: 'capsule' },
    { label: 'Круг', value: 'circle' }
  ]
} as const

export const colorList = {
  label: 'Цвет',
  value: 'color',
  navItems: [
    { label: 'Серый', value: '#c0c0c0' },
    { label: 'Красный', value: '#ff0000' },
    { label: 'Розовый', value: '#ffc0cb' },
    { label: 'Зеленый', value: '#008000' },
    { label: 'Оранжевый', value: '#ffa500' },
    { label: 'Желтый', value: '#ffff00' },
    { label: 'Сизый', value: '#53dfdd' },
    { label: 'Фиолетовый', value: '#ee82ee' },
    { label: 'Синий', value: '#0000ff' }
  ]
} as const

export const borderList = {
  label: 'Обводка',
  value: 'border',
  navItems: [
    { label: 'Цельная', value: 'solid' },
    { label: 'Черточками', value: 'dashed' },
    { label: 'Точками', value: 'dotted' }
  ]
} as const

export const textAlignList = {
  label: 'Выравнивание',
  value: 'align',
  navItems: [
    { label: 'Лево', value: 'left' },
    { label: 'Центр', value: 'center' },
  ]
} as const

export const navigationList = [shapeList, colorList, borderList, textAlignList] as const
