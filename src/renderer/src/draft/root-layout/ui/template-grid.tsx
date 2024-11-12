import { Grid2 as Grid, Stack } from '@mui/material'

import { FC, ReactNode } from 'react'

export const TemplateGrid: FC<{
  sidebarContent: () => ReactNode
  selectedContend: () => ReactNode
}> = ({ selectedContend, sidebarContent }) => {
  return (
    <Grid container height="100vh">
      <Grid
        size={{ xs: 6, md: 3 }}
        sx={({ palette }) => ({
          bgcolor: palette.background['paper'],
          borderRight: '1px solid silver',
          height: '100vh',
          overflow: 'scroll'
        })}
      >
        {sidebarContent()}
      </Grid>
      <Grid size={{ xs: 6, md: 9 }} sx={{ position: 'relative' }}>
        <Stack
          direction="row"
          sx={{
            justifyContent: 'center',
            height: '100vh',
            overflow: 'scroll'
          }}
        >
          {selectedContend()}
        </Stack>
      </Grid>
    </Grid>
  )
}
