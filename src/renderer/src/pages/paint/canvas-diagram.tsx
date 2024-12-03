import React, { FC, useEffect, useRef, useState } from 'react'
// import {
//   Diagram,
//   DISABLE_NODE_USER_INTERACTION_CLASS,
//   INodeVisualComponentProps,
//   Port,
//   RootStore,
//   addNodeCommand,
//   useDiagram
// } from 'react-easy-diagram'
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
import { Box } from '@mui/material'

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

const NodeWithInternalData = observer<INodeVisualComponentProps>(({ entity: node }) => {
  const linesNumber = node.data ?? 0

  const lines = useLines(linesNumber)

  return (
    <div
      className="react_fast_diagram_NodeDefault"
      style={{
        padding: 15,
        border: node.selected ? '#6eb7ff solid 1px' : ''
      }}
    >
      <div>Node with internal state that cause node resize</div>
      <div>Fields:</div>

      {lines.map((l) => l)}

      <div>
        <button
          className={DISABLE_NODE_USER_INTERACTION_CLASS}
          type="button"
          onClick={() => node.setData(linesNumber + 1)}
        >
          Add line
        </button>
      </div>

      {Array.from(node.ports).map(([id]) => (
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

const listener = (rootStore, selectedFilePath) => {
  fileSystemAdapter.updateFile(selectedFilePath, JSON.stringify(rootStore.export()))
}

// Создаем debounced-функцию, которая будет вызываться только после 300 мс тишины
const debouncedListener = debounce(listener, 300)

const listenersConfig = (selectedFilePath) => {
  let isReady = false

  return {
    onNodePositionChanged: (_, rootStore) => {
      isReady && debouncedListener(rootStore, selectedFilePath)
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

  // useEffect(() => {
  //   console.log(storeRef.current, 'test')
  // }, [storeRef.current])

  if (!isInitDataReady) {
    return <div>process</div>
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault() // Разрешаем сброс
  }

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault()
  }

  const dbcHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const data = storeRef.current.diagramState.offset

    const rect = event.currentTarget.getBoundingClientRect() // Получаем границы диаграммы
    // const clickX = event.clientX - rect.left
    // const clickY = event.clientY - rect.top
    //
    // const newNodeId = `node${Math.random().toString(36).substring(2, 7)}`
    // const { scale, translateX, translateY } = storeRef.current.diagramState || {}
    //
    // // Корректируем координаты с учетом трансформации
    // const adjustedX = (clickX - translateX) / scale
    // const adjustedY = (clickY - translateY) / scale
    //
    // storeRef.current.commandExecutor.execute(
    //   addNodeCommand({
    //     id: newNodeId,
    //     position: [adjustedX, adjustedY],
    //     type: 'star'
    //   })
    // )
  }

  return (
    // <Box
    //   style={{ width: '100%' }}
    //   onDoubleClick={dbcHandler}
    //   onDragOver={handleDragOver}
    //   onDrop={handleDrop}
    // >
    <Diagram
      storeRef={storeRef}
      initState={initData}
      settings={{
        nodes: {
          components: {
            output_horizontal: {
              component: NodeWithInternalData,
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
    // </Box>
  )
}
