import { FC, ReactNode } from 'react'
import { Box, CircularProgress } from '@mui/material'

export const PomadoroLayout: FC<{
  isLoading?: boolean
  stepper: () => ReactNode
  content: () => ReactNode
}> = ({ isLoading, content, stepper }) => {
  return (
    <Box sx={{ width: '100%', position: 'relative', paddingTop: '190px' }}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {stepper()}
          <Box sx={{ p: '10px' }}>{content()}</Box>
        </>
      )}
    </Box>
  )
}
