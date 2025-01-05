import { navigationList } from './const'

export type NavigationItem = (typeof navigationList)[number]
export type NavigationItemValue = NavigationItem['value']
