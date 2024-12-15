import { observer } from 'mobx-react-lite'
import React, { useEffect, useMemo } from 'react'
import type { ILinkState } from '@easy-diagram/states/linkState'
import type { INodeState } from '@easy-diagram/states/nodeState'
import type { ISettings } from '@easy-diagram/states/rootStore'
import { RootStore } from '@easy-diagram/states/rootStore'
import { IDiagramState } from '@renderer/api/easy-components'

export const RootStoreContext = React.createContext<RootStore | null>(null)

export const DiagramContext = observer((props: IDiagramContextProps) => {
  const [rootStore, initialSettings, initialState] = useMemo(
    () => [new RootStore(props.settings, props.initState), props.settings, props.initState],
    []
  )

  useEffect(() => {
    if (initialSettings !== props.settings) {
      rootStore.importSettings(props.settings)
    }
  }, [rootStore, props.settings, initialSettings])

  useEffect(() => {
    rootStore.diagramState.import(initialState)
    if (initialState !== props.initState) {
      rootStore.importState(props.initState?.nodes ?? [], props.initState?.links ?? [])
    }
  }, [rootStore, props.initState, initialState])

  useEffect(() => {
    if (props.storeRef) {
      props.storeRef.current = rootStore
    }
  }, [rootStore, props.storeRef])

  return <RootStoreContext.Provider value={rootStore}>{props.children}</RootStoreContext.Provider>
})

export type IDiagramContextProps = React.PropsWithChildren<{
  settings?: ISettings
  initState?: IDiagramInitState
  storeRef?: React.MutableRefObject<RootStore | null>
}>

export interface IDiagramInitState extends IDiagramState {
  nodes?: INodeState[]
  links?: ILinkState[]
}
