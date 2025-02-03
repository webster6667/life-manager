import IconButton from '@mui/material/IconButton'
// import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import { FC } from 'react'

export const TooltipMenu: FC = ({ children }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-block',
        '&:hover .menu-list': {
          visibility: 'visible',
          opacity: 1
        }
      }}
    >
      <IconButton sx={{ position: 'relative', zIndex: 2 }}>
        <MoreVertIcon />
      </IconButton>
      <Paper
        className="menu-list"
        sx={{
          position: 'absolute',
          top: '100%',
          right: 0,
          backgroundColor: 'white',
          boxShadow: 3,
          visibility: 'hidden',
          opacity: 0,
          transition: 'opacity 0.3s ease, visibility 0.3s ease'
        }}
      >
        {children}
      </Paper>
    </Box>
  )
}
