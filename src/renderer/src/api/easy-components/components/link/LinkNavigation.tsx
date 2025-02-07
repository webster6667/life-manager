import { observer } from 'mobx-react-lite'
import { useRootStore } from '@easy-diagram/hooks/useRootStore'
import { Box } from '@mui/material'
import { borderList, colorList } from '@renderer/pages/paint/components/star-node/const'
import { PrimaryNodeNavigation } from '@renderer/pages/paint/components/star-node/components/primary-node-navigation'
import { listener } from '@renderer/pages/paint/canvas-diagram'

const getSvgPathWidth = (svgPath: string): number => {
  const numbers = svgPath.match(/-?\d+(\.\d+)?/g)?.map(Number) || []
  if (numbers.length === 0) return 0

  const xValues: number[] = numbers.filter((_, index) => index % 2 === 0)
  return Math.max(...xValues) - Math.min(...xValues)
}

export const LinkNavigation = observer(() => {
  const rootStore = useRootStore()
  const isLinkSelected = rootStore?.selectionState.selectedLinks.length === 1
  const selectedLink = rootStore?.selectionState.selectedLinks[0]
  const { svgPath, source } = selectedLink?.path || {}
  const coords = source || [0, 0]
  const width = svgPath ? getSvgPathWidth(svgPath) : 0

  const coordsStyle = {
    left: `${coords[0] - width / 2}px`,
    top: `${coords[1]}px`
  }

  const navigationItemClickHandler = (value, navProps) => {
    selectedLink.setData({
      ...selectedLink.data,
      [navProps]: value
    })
    listener(rootStore, localStorage.getItem('selectedFile'))
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: '999',
        visibility: isLinkSelected ? 'visible' : 'hidden',
        pointerEvents: 'auto',
        ...coordsStyle
      }}
    >
      <PrimaryNodeNavigation
        navigationItemClickHandler={navigationItemClickHandler}
        shapeOptions={{
          color: selectedLink?.data?.color || colorList.navItems[0].value,
          border: selectedLink?.data?.border || borderList.navItems[0].value
        }}
      />
    </Box>
  )
})
