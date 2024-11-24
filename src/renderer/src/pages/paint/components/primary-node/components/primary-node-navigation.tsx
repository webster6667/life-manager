import { Box, List, ListItemButton, Tab, Tabs } from '@mui/material'
import { navigationList } from './../const'
import { FC, useState } from 'react'
import { NavigationItemValue } from './../types'

type NavigationItem = (typeof navigationList)[number]
type NavItemValue = NavigationItem['value']

export const PrimaryNodeNavigation: FC<{
  navigationItemClickHandler: (value: string, navigationValue: NavigationItemValue) => void
}> = ({ navigationItemClickHandler }) => {
  const [navigationValue, setNavigationValue] = useState<NavItemValue>()

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '100%',
        left: 0
      }}
    >
      <Tabs
        value={navigationValue || navigationList[0].value}
        onChange={(_, value) => setNavigationValue(value)}
      >
        {navigationList.map(({ value, label }) => (
          <Tab value={value} label={label} key={value} />
        ))}
      </Tabs>

      {/*{navigationList && (*/}
      {/*  <List>*/}
      {/*    {(navigationList.find(({ value }) => value == navigationValue)['navItems'] || []).map(*/}
      {/*      ({ label, value }) => (*/}
      {/*        <ListItemButton*/}
      {/*          key={value}*/}
      {/*          onClick={() => navigationItemClickHandler(value, navigationValue)}*/}
      {/*        >*/}
      {/*          {label}*/}
      {/*        </ListItemButton>*/}
      {/*      )*/}
      {/*    )}*/}
      {/*  </List>*/}
      {/*)}*/}
    </Box>
  )
}
