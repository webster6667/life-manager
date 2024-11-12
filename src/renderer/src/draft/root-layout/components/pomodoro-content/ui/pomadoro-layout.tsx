import { FC, ReactNode } from 'react'
import { Box, CircularProgress } from '@mui/material'

export const PomadoroLayout: FC<{
  isLoading?: boolean
  stepper: () => ReactNode
  content: () => ReactNode
}> = ({ isLoading, content, stepper }) => {
  return (
    <Box sx={{ width: '100%' }}>
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
