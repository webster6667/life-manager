import { FC, ReactNode } from 'react'
import { Stack } from '@mui/material'

export const FooterNav: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Stack flexDirection={'row'} columnGap={'15px'}>
      {children}
    </Stack>
  )
}
