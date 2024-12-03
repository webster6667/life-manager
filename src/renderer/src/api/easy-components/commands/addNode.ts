import { INodeState } from '@easy-diagram/states/nodeState'
import { RootStore } from '@easy-diagram/states/rootStore'
import { isSuccess } from '@easy-diagram/utils/result'

export const addNodeCommand = (node: INodeState) => ({
  execute(rootStore: RootStore) {
    const result = rootStore.nodesStore.addNode(node, false)
    if (isSuccess(result)) {
      rootStore.selectionState.select(result.value, true)
    }
  }
})
