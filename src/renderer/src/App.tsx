import { globalStyles } from '@global-styles'
import { Global } from '@emotion/react'
import { ThemeProvider } from '@mui/material/styles'

import { primaryTheme } from './theme'
import { RootLayout } from '@renderer/draft/root-layout'
import { Box } from '@mui/material'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ReactComponent as Tomato } from '@assets/img/icons/tomato/tom.svg'

import { AccessAlarm, Brush, Assignment } from '@mui/icons-material' // Import MUI icons

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CommonNav } from '@renderer/draft/common-nav'
import Paint from '@renderer/pages/paint'

export const routes = [
  { path: '/pomodoro', label: 'Помидор', component: <RootLayout />, icon: <AccessAlarm /> },
  { path: '/paint', label: 'Рисование', component: <Paint />, icon: <Brush /> },
  { path: '/task', label: 'Задачи', component: <div>tasks</div>, icon: <Assignment /> }
]

function App(): JSX.Element {
  return (
    <>
      {/*<CssBaseline />*/}
      <Global styles={globalStyles} />

      <ThemeProvider theme={primaryTheme}>
        <BrowserRouter basename="/">
          <Box sx={{ paddingLeft: '56px' }}>
            <CommonNav />
            <Routes>
              {routes.map((route) => (
                <Route key={route.path} path={route.path} element={route.component} />
              ))}
            </Routes>
          </Box>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App
