import { Box, Grid2 as Grid, ListItemButton, Stack } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos'

import { FC, ReactNode } from 'react'
import { useToggle } from '@renderer/front-shared/hooks'

export const TemplateGrid: FC<{
  sidebarContent: () => ReactNode
  selectedContend: () => ReactNode
  sidebarRightContent: () => ReactNode
}> = ({ selectedContend, sidebarContent, sidebarRightContent }) => {
  const [isNavOpen, toggleNavOpen] = useToggle(true)
  const [isRightNavOpen, toggleRightNavOpen] = useToggle(false)

  return (
    <Grid container height="100%" width="100%">
      {sidebarContent && (
        <Grid
          minWidth={isNavOpen ? '28%' : '50px'}
          maxWidth={'28%'}
          height="100%"
          sx={{ position: 'relative', zIndex: '9999' }}
        >
          <Box
            sx={({ palette }) => ({
              bgcolor: palette.background.paper,
              borderRight: `1px solid ${palette.divider}`,
              overflow: 'auto',
              height: '100%'
            })}
          >
            {isNavOpen && sidebarContent()}
          </Box>

          <ListItemButton
            sx={{
              minWidth: 'auto',
              width: '45px',
              position: 'absolute',
              left: '100%',
              top: '30px',
              borderRadius: '50%',
              transform: `translateX(${isNavOpen ? '10px' : '-48px'})`
            }}
            onClick={() => toggleNavOpen()}
          >
            {isNavOpen ? <ArrowBackIosIcon /> : <ArrowForwardIos />}
          </ListItemButton>
        </Grid>
      )}
      <Grid sx={{ position: 'relative', flexGrow: '1' }} width="auto" height="100%">
        <Stack
          direction="row"
          height="100%"
          sx={{
            justifyContent: 'center',
            overflow: 'auto'
          }}
        >
          {selectedContend()}
        </Stack>
      </Grid>
      {sidebarRightContent && (
        <Grid
          minWidth={isRightNavOpen ? '30%' : '50px'}
          maxWidth={'30%'}
          height="100%"
          sx={{ position: 'relative', zIndex: '9999' }}
        >
          <Box
            sx={({ palette }) => ({
              bgcolor: palette.background.paper,
              borderLeft: `1px solid ${palette.divider}`,
              overflow: 'auto',
              height: '100%'
            })}
          >
            {isRightNavOpen && sidebarRightContent()}
          </Box>

          <ListItemButton
            sx={{
              minWidth: 'auto',
              width: '45px',
              position: 'absolute',
              right: '100%',
              top: '30px',
              borderRadius: '50%',
              transform: `translateX(${isRightNavOpen ? '-10px' : '48px'})`
            }}
            onClick={() => toggleRightNavOpen()}
          >
            {isRightNavOpen ? <ArrowForwardIos /> : <ArrowBackIosIcon />}
          </ListItemButton>
        </Grid>
      )}
    </Grid>
  )
}
