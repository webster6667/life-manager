import { Box, Grid2 as Grid, ListItemButton, Stack } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { FC, ReactNode } from 'react'
import { useToggle } from '@renderer/front-shared/hooks'

export const TemplateGrid: FC<{
  sidebarContent: () => ReactNode
  selectedContend: () => ReactNode
}> = ({ selectedContend, sidebarContent }) => {
  const [isNavOpen, toggleNavOpen] = useToggle(true)

  return (
    <Grid container height="100%" width="100%">
      <Grid
        width={isNavOpen ? '30%' : '50px'}
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
          <ArrowBackIosIcon />
        </ListItemButton>
      </Grid>
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
    </Grid>
  )
}
