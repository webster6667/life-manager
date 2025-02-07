import { Grid2 as Grid, Stack } from '@mui/material'

import { FC, ReactNode } from 'react'

export const TemplateGrid: FC<{
  sidebarContent: () => ReactNode
  selectedContend: () => ReactNode
}> = ({ selectedContend, sidebarContent }) => {
  return (
    <Grid container height="100%" width="100%">
      <Grid
        size={{ xs: 6, md: 3 }}
        sx={({ palette }) => ({
          bgcolor: palette.background.paper,
          borderRight: `1px solid ${palette.divider}`,
          overflow: 'auto'
        })}
        height="100%"
      >
        {sidebarContent()}
      </Grid>
      <Grid size={{ xs: 6, md: 9 }} sx={{ position: 'relative' }} height="100%">
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
