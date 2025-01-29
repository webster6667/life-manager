import { List, ListItemButton, ListItemIcon } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { routes } from '@renderer/App'

export const CommonNav = () => {
  const location = useLocation() // Отслеживание текущего URL

  return (
    <List
      sx={(theme) => ({
        padding: '0',
        width: '56px',
        bgcolor: 'background.default',
        borderRight: `1px solid ${theme.palette.divider}`
      })}
    >
      {routes.map(({ path, icon }) => (
        <Link to={path} key={path}>
          <ListItemButton
            selected={location?.pathname === path}
            sx={{ width: '100%', p: '12px 15px' }}
          >
            <ListItemIcon sx={{ minWidth: 'auto' }}>{icon}</ListItemIcon>
          </ListItemButton>
        </Link>
      ))}
    </List>
  )
}
