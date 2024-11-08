import { globalStyles } from '@global-styles'
import { Global } from '@emotion/react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import { primaryTheme } from './theme'
import { RootLayout } from '@renderer/draft/root-layout'

function App(): JSX.Element {
  return (
    <>
      <CssBaseline />
      <Global styles={globalStyles} />

      <ThemeProvider theme={primaryTheme}>
        <RootLayout />
      </ThemeProvider>
    </>
  )
}

export default App
