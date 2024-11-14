import { useToggle } from '@common-hook'
import { Collapse, Stack, Typography } from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { FC, ReactNode } from 'react'

export const DropDown: FC<{ children: ReactNode; label: string }> = ({ children, label }) => {
  const [isDropDownOpen, toggleDropDownOpen] = useToggle(false)

  return (
    <Stack>
      <Stack onClick={toggleDropDownOpen} flexDirection="row" justifyContent="space-between">
        <Typography variant="h6">{label}</Typography>
        {isDropDownOpen ? <ExpandLess /> : <ExpandMore />}
      </Stack>
      <Collapse in={isDropDownOpen} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </Stack>
  )
}
