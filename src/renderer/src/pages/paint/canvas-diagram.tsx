import React, { FC, useRef } from 'react'

import { addNodeCommand, Diagram, IDiagramInitState, RootStore } from '@easy-diagram/index'

import { debounce } from 'lodash'
import { fileSystemAdapter } from '@renderer/api/fileSystemAdapter'
import { useDidMount } from '@common-hook'
import { StarNode } from '@renderer/pages/paint/components/star-node/star-node'
import { PortalNode } from '@renderer/pages/paint/components/portal-node/portal-node'
import { IPortState } from 'react-easy-diagram'

const listener = (rootStore: RootStore, selectedFilePath) => {
  // console.log({ ...rootStore.linksStore.links }, 'links')

  // console.log(Array.from(rootStore.linksStore.links)[0][1].path, 'test')
  // console.log(JSON.parse(JSON.stringify(rootStore.export())), selectedFilePath, 'test')

  fileSystemAdapter.updateFile(
    selectedFilePath,
    JSON.stringify({
      ...rootStore.export(),
      zoom: rootStore.diagramState.zoom,
      offset: rootStore.diagramState.offset,
      type: 'canvas'
    })
  )
}

// Создаем debounced-функцию, которая будет вызываться только после 300 мс тишины
export const debouncedListener = debounce(listener, 300)

const listenersConfig = (selectedFilePath) => {
  let isReady = false

  return {
    onNodePositionChanged: (_, rootStore) => {
      isReady && debouncedListener(rootStore, selectedFilePath)
    },
    onChangeOffset: (rootStore) => {
      isReady && listener(rootStore, selectedFilePath)
    },
    onChangeZoom: (rootStore) => {
      isReady && listener(rootStore, selectedFilePath)
    },
    onNodesAddResult: (_, rootStore) => {
      isReady && listener(rootStore, selectedFilePath)
    },
    onNodesRemoveResult: (_, rootStore) => {
      isReady && listener(rootStore, selectedFilePath)
    },
    onLinksAddResult: (_, rootStore) => {
      isReady && listener(rootStore, selectedFilePath)
    },
    onLinksRemoveResult: (_, rootStore, isReady) => {
      isReady && listener(rootStore, selectedFilePath)
    },
    onImportedStateRendered: () => {
      isReady = true
    }
  }
}

export const CanvasDiagram: FC<{ selectedFilePath: string; initData: object }> = ({
  selectedFilePath,
  initData
}) => {
  const storeRef = useRef<RootStore>(null)

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault() // Разрешаем сброс
  }

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault()
    const { clientX, clientY, currentTarget } = event
    const rect = currentTarget.getBoundingClientRect()
    const { zoom, offset } = storeRef.current.diagramState

    // Координаты клика относительно контейнера
    const x = (clientX - rect.left - offset[0]) / zoom
    const y = (clientY - rect.top - offset[1]) / zoom
    const newNodeId = `node${Math.random().toString(36).substring(2, 7)}`
    const portalFilePath = event.dataTransfer.getData('text/plain')
    const fileData = (await fileSystemAdapter
      .readFile(portalFilePath)
      .then((res) => JSON.parse(res))) as IDiagramInitState
    const portalPorts: IPortState[] = []

    fileData.nodes.forEach(({ ports, id: nodeId }) => {
      ports.forEach(({ id: portId }) => {
        portalPorts.push({ id: portId + '_' + nodeId, position: portId + '-center' })
      })
    })

    // fileData.links.map((link) => ({
    //   ...link,
    //   target: {
    //     nodeId: newNodeId,
    //     portId: `${link.target.portId}_${newNodeId}`
    //   },
    //   source: {
    //     nodeId: newNodeId,
    //     portId: `${link.source.portId}_${newNodeId}`
    //   }
    // }))

    // storeRef.current.linksStore.addLinks(link)

    storeRef.current.commandExecutor.execute(
      addNodeCommand({
        id: newNodeId,
        position: [x, y],
        type: 'portal',
        data: {
          portalFilePath: portalFilePath
        },
        ports: portalPorts
      })
    )
  }

  return (
    <Diagram
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      storeRef={storeRef}
      initState={initData}
      settings={{
        nodes: {
          components: {
            star: {
              component: StarNode,
              settings: {
                ports: [
                  { id: 'left', position: 'left-center' },
                  { id: 'top', position: 'top-center' },
                  { id: 'right', position: 'right-center' },
                  { id: 'bottom', position: 'bottom-center' }
                ]
              }
            },
            portal: {
              component: PortalNode
            }
          }
        },
        callbacks: listenersConfig(selectedFilePath)
      }}
    />
  )
}
