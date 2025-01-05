import { Box, List, ListItemButton, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { navigationList } from './../const'
import { FC, useState } from 'react'
import { NavigationItemValue } from './../types'

type NavigationItem = (typeof navigationList)[number]
type NavItemValue = NavigationItem['value']

import rectangle from './shape/rectangle.svg'
import capsule from './shape/capsule.svg'
import circle from './shape/circle.svg'
import rhomb from './shape/rhomb.svg'
import parallelogram from './shape/parallelogram.svg'

import colorPalette from './color-palette.svg'

import solid from './line/solid.svg'
import dashed from './line/dashed.svg'
import dotted from './line/dotted.svg'

import center from './align/center.svg'
import left from './align/left.svg'

const shapeIcons = {
  rectangle,
  capsule,
  circle,
  rhomb,
  parallelogram
}

const lineIcons = {
  solid,
  dashed,
  dotted,
}

const alignIcons = {
  left,
  center
}

export const PrimaryNodeNavigation: FC<{
  navigationItemClickHandler: (value: string, navigationValue: NavigationItemValue) => void
  shapeOptions: Record<NavigationItemValue, string>
}> = ({ navigationItemClickHandler, shapeOptions }) => {
  const [navigationValue, setNavigationValue] = useState<NavItemValue>()

  const handleChangeTab = (_, clickedNavigationValue: NavItemValue) => {
    setNavigationValue(clickedNavigationValue)
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '100%',
        left: 0
      }}
    >
      <ToggleButtonGroup
        value={navigationValue}
        exclusive
        onChange={handleChangeTab}
        aria-label="navigation"
        sx={{
          background: 'silver'
        }}
      >
        <ToggleButton value={'shape'} aria-label={'shape'}>
          <img style={{ width: '20px' }} src={shapeIcons[shapeOptions.shape]} alt="" />
        </ToggleButton>
        <ToggleButton value={'color'} aria-label={'color'}>
          <img style={{ width: '20px' }} src={colorPalette} alt="" />
        </ToggleButton>
        <ToggleButton value={'border'} aria-label={'border'}>
          <img style={{ width: '20px' }} src={lineIcons[shapeOptions.border]} alt="" />
        </ToggleButton>
        <ToggleButton value={'align'} aria-label={'align'}>
          <img style={{ width: '20px' }} src={alignIcons[shapeOptions.align]} alt="" />
        </ToggleButton>
      </ToggleButtonGroup>

      {navigationValue && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          <List sx={{ background: 'silver', mt: '10px', borderRadius: '5px' }}>
            {(navigationList.find(({ value }) => value == navigationValue)['navItems'] || []).map(
              ({ label, value }) => (
                <ListItemButton
                  key={value}
                  selected={shapeOptions[navigationValue] === value}
                  onClick={() => navigationItemClickHandler(value, navigationValue)}
                >
                  {label}
                </ListItemButton>
              )
            )}
          </List>
        </Box>
      )}
    </Box>
  )
}
