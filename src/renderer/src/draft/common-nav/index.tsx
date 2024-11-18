import { List, ListItemButton, ListItemIcon } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { routes } from '@renderer/App'

export const CommonNav = () => {
  const location = useLocation() // Отслеживание текущего URL

  return (
    <List sx={{ position: 'fixed', top: '0', left: '0', width: '56px' }}>
      {routes.map(({ path, icon }) => (
        <Link to={path} key={path}>
          <ListItemButton selected={location?.pathname === path} sx={{ width: '100%' }}>
            <ListItemIcon sx={{ minWidth: 'auto' }}>{icon}</ListItemIcon>
          </ListItemButton>
        </Link>
      ))}
    </List>
  )
}
