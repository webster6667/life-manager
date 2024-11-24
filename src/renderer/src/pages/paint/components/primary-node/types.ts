import { DiagramEngine } from '@projectstorm/react-diagrams'
import { PrimaryNodeModel } from './index'
import { PrimaryPortModel } from './primary-port'
import { navigationList } from '@renderer/pages/paint/components/primary-node/const'

export interface PrimaryNodeModelGenerics {
  PORT: PrimaryPortModel
}

export interface PrimaryNodeWidgetProps {
  node: PrimaryNodeModel
  engine: DiagramEngine
  size?: number
}

type NavigationItem = (typeof navigationList)[number]
export type NavigationItemValue = NavigationItem['value']
