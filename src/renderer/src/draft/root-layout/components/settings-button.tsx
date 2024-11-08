import { Settings } from '@mui/icons-material'
import { IconButton } from '@mui/material'

export const SettingsButton = () => {
  return (
    <IconButton aria-label="delete" sx={{ position: 'absolute', bottom: '5px', right: '5px' }}>
      <Settings />
    </IconButton>
  )
}
