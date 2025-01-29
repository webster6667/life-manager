import { globalStyles } from '@global-styles'
import { Global } from '@emotion/react'
import { ThemeProvider, CssBaseline } from '@mui/material'

import { primaryTheme } from './theme'
import { RootLayout } from '@renderer/draft/root-layout'
import { Stack } from '@mui/material'

import { AccessAlarm, Brush, Assignment } from '@mui/icons-material' // Import MUI icons

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CommonNav } from '@renderer/draft/common-nav'
import Paint from '@renderer/pages/paint'
import { HeaderPlash } from './draft/header-plash'

export const routes = [
  { path: '/pomodoro', label: 'Помидор', component: <RootLayout />, icon: <AccessAlarm /> },
  { path: '/paint', label: 'Рисование', component: <Paint />, icon: <Brush /> },
  { path: '/task', label: 'Задачи', component: <div>tasks</div>, icon: <Assignment /> }
]

function App(): JSX.Element {
  return (
    <>
      <Global styles={globalStyles} />

      <ThemeProvider theme={primaryTheme}>
        <CssBaseline />

        <BrowserRouter basename="/">
          <HeaderPlash />
          <Stack flexDirection="row" height="100%" sx={{ bgcolor: 'background.default' }}>
            <CommonNav />
            {/* <Stack flexGrow="1"> */}
            <Routes>
              {routes.map((route) => (
                <Route key={route.path} path={route.path} element={route.component} />
              ))}
            </Routes>
            {/* </Stack> */}
          </Stack>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App
