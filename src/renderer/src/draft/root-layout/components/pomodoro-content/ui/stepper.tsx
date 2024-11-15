import { Box, Stepper as OriginStepper } from '@mui/material'
import { FC, ReactNode } from 'react'

export const Stepper: FC<{ selectedStepIndex: number; children: ReactNode }> = ({
  children,
  selectedStepIndex
}) => {
  return (
    <OriginStepper
      activeStep={selectedStepIndex}
      alternativeLabel
      connector={<Box sx={{ width: '100px', height: '2px', background: 'silver', mr: '16px' }} />}
      sx={{
        padding: '0 20px',
        paddingBottom: '60px',
        paddingTop: '30px',
        alignItems: 'center',
        overflowX: 'scroll',
        position: 'sticky',
        top: '0',
        background: 'white',
        zIndex: '9999',
        boxShadow: '0 0 17px #0000007d',
        scrollbarWidth: 'none',

        '& .MuiStep-horizontal': {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }
      }}
    >
      {children}
    </OriginStepper>
  )
}
