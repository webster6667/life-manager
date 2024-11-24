import { Box } from '@mui/material'
import { FC, HTMLProps } from 'react'
import { canvasId } from '@renderer/pages/paint/const'

export const CanvasWrapper: FC<HTMLProps<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }} {...props}>
      <Box
        id={canvasId}
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          '& > div': {
            width: '100%',
            height: '100%'
          }
        }}
      >
        {children}
      </Box>
    </div>
  )
}
