import { useContext } from 'react'
import { RootStoreContext } from '@easy-diagram/components/DiagramContext'
import { RootStore } from '@easy-diagram/states/rootStore'

export const useRootStore = () => useContext(RootStoreContext) as RootStore
