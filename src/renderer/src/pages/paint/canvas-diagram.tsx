import React, { FC, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'

import {
  Diagram,
  DISABLE_NODE_USER_INTERACTION_CLASS,
  INodeVisualComponentProps,
  Port,
  RootStore,
  useDiagram
} from '@easy-diagram/index'

import { debounce } from 'lodash'
import { fileSystemAdapter } from '@renderer/api/fileSystemAdapter'
import { useDidMount } from '@common-hook'
import { StarNode } from '@renderer/pages/paint/components/star-node/star-node'

const NodeWithExternalData = observer<INodeVisualComponentProps>(({ entity }) => {
  const [linesNumber, setLinesNumber] = useState<number>(0)

  useEffect(() => {
    // Size and position changes in DOM element are not reported to the library, so it is
    // required to trigger recalculation if you think size or position is changed. There is also
    // possibility to store your data that could change size or position in port's or node's "data" property,
    // changes in these properties along with the other are already handled by library.
    entity.recalculatePortsOffset()
  }, [linesNumber])

  const lines = useLines(linesNumber)

  return (
    <div
      className="react_fast_diagram_NodeDefault"
      style={{
        padding: 15,
        border: entity.selected ? '#6eb7ff solid 1px' : ''
      }}
    >
      <div>Node with external state that cause node resize</div>
      <div>Fields:</div>

      {lines.map((l) => l)}

      <div>
        <button
          className={DISABLE_NODE_USER_INTERACTION_CLASS}
          type="button"
          onClick={() => setLinesNumber((c) => c + 1)}
        >
          Add line
        </button>
      </div>

      {Array.from(entity.ports).map(([id]) => (
        <Port id={id} key={id} />
      ))}
    </div>
  )
})

function useLines(count: number) {
  const lines = []
  for (let i = 0; i < count; i++) {
    lines.push(<span key={i}>Line {i}</span>)
  }
  return lines
}

const listener = (rootStore: RootStore, selectedFilePath) => {
  fileSystemAdapter.updateFile(
    selectedFilePath,
    JSON.stringify({
      ...rootStore.export(),
      zoom: rootStore.diagramState.zoom,
      offset: rootStore.diagramState.offset
    })
  )
}

// Создаем debounced-функцию, которая будет вызываться только после 300 мс тишины
const debouncedListener = debounce(listener, 300)

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

export const CanvasDiagram: FC<{ selectedFilePath: string }> = ({ selectedFilePath }) => {
  const storeRef = useRef<RootStore>(null)
  const { commandExecutor } = useDiagram()

  const [isInitDataReady, initData] = useDidMount(async () => {
    const data = await fileSystemAdapter.readFile(selectedFilePath)

    return JSON.parse(data)
  })

  if (!isInitDataReady) {
    return <div>process</div>
  }

  return (
    <Diagram
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
            input_horizontal: {
              component: NodeWithExternalData,
              settings: {
                ports: [
                  { id: 'left', position: 'left-center' },
                  { id: 'top', position: 'top-center' },
                  { id: 'right', position: 'right-center' },
                  { id: 'bottom', position: 'bottom-center' }
                ]
              }
            }
          }
        },
        callbacks: listenersConfig(selectedFilePath)
      }}
    />
  )
}
