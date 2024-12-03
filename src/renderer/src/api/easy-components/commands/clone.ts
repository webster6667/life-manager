import { INodeState } from '@easy-diagram/states/nodeState'
import { RootStore } from '@easy-diagram/states/rootStore'
import { addPoints } from '@easy-diagram/utils/point'

export const cloneSelectedNodesCommand = {
  execute(rootStore: RootStore) {
    const nodeStates = rootStore.selectionState.selectedNodes.map((node) => {
      const nodeState = node.export() as INodeState
      nodeState.id = undefined
      nodeState.label = nodeState.label
      nodeState.position = addPoints(nodeState.position, [50, 50])

      return nodeState
    })

    rootStore.nodesStore.addNodes(nodeStates, false)
  }
}
