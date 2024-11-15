import { Box, Step as OriginStep } from '@mui/material'
import { FC, ReactNode } from 'react'

export const Step: FC<{
  selectedStepIndex: number
  index: number
  onClick: () => void
  children: ReactNode
}> = ({ selectedStepIndex, index, onClick, children, ...props }) => {
  const isSelectedStep = index === selectedStepIndex
  return (
    <OriginStep sx={{ flexDirection: 'column' }} {...props}>
      <Box
        display="flex"
        alignItems="center"
        sx={{
          margin: 'auto 0',
          borderRadius: '50%',
          cursor: isSelectedStep ? 'auto' : 'pointer',
          boxShadow: isSelectedStep ? 'inset 0 0 15px 1px #a2a2ffa6' : 'inset 0 0 0 1px silver',
          '& > div:hover > div:first-child': {
            transform: isSelectedStep ? `scale(1)` : `scale(1.2)`
          }
        }}
        onClick={() => onClick()}
      >
        {children}
      </Box>
    </OriginStep>
  )
}
