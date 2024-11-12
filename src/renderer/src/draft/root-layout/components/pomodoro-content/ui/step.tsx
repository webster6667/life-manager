import { Box, Step as OriginStep } from '@mui/material'
import { FC, ReactNode } from 'react'

export const Step: FC<{
  activeStepIndex: number
  index: number
  onClick: () => void
  children: ReactNode
}> = ({ activeStepIndex, index, onClick, children, ...props }) => {
  return (
    <OriginStep sx={{ flexDirection: 'column' }} {...props}>
      <Box
        display="flex"
        alignItems="center"
        sx={{
          margin: 'auto 0',
          borderRadius: '50%',
          cursor: index === activeStepIndex ? 'auto' : 'pointer',
          boxShadow:
            index === activeStepIndex ? 'inset 0 0 15px 1px #a2a2ffa6' : 'inset 0 0 0 1px silver',
          '& > div:hover > div:first-child': {
            transform: index === activeStepIndex ? `scale(1)` : `scale(1.2)`
          }
        }}
        onClick={() => onClick()}
      >
        {children}
      </Box>
    </OriginStep>
  )
}
