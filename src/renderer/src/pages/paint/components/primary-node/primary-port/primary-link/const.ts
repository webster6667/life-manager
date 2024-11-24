import { PortModelAlignment } from '@projectstorm/react-diagrams'

export const portMirrorMap = {
  [PortModelAlignment.BOTTOM]: PortModelAlignment.TOP,
  [PortModelAlignment.TOP]: PortModelAlignment.BOTTOM,
  [PortModelAlignment.LEFT]: PortModelAlignment.RIGHT,
  [PortModelAlignment.RIGHT]: PortModelAlignment.LEFT
}

export const colors = ['blue', 'black', 'red']
