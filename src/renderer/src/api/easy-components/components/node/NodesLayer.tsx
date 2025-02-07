import { observer } from 'mobx-react-lite'
import { useRootStore } from '@easy-diagram/hooks/useRootStore'
import { NodeWrapper } from '@easy-diagram/components/node/NodeWrapper'
import { LinkNavigation } from '../link/LinkNavigation'

export const NodesLayer = observer<{
  transform: string
}>(({ transform }) => {
  return (
    <div className="react_fast_diagram_Layer diagram_nodes_layer" style={{ transform: transform }}>
      <NodesList />
      <LinkNavigation />
    </div>
  )
})

const NodesList = observer(() => {
  const { nodesStore } = useRootStore()
  return (
    <>
      {Array.from(nodesStore.nodes).map(([id, node]) => (
        <NodeWrapper key={node.id} node={node} />
      ))}
    </>
  )
})
