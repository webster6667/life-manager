import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import { PrimaryTextInput } from '@ui-kit/inputs/text-input/primary'
import { primaryTheme } from '@app-theme'
import { ThemeProvider } from 'styled-components'
import { fileSystemAdapter } from './api/fileSystemAdapter'

function App(): JSX.Element {
  return (
    <>
      <ThemeProvider theme={primaryTheme}>
        <img alt="logo" className="logo" src={electronLogo} />
        <PrimaryTextInput />
        <div className="creator">Powered by electron-vite</div>
        <div className="text">
          Build an Electron app with <span className="react">Reaction</span>
          &nbsp;and <span className="ts">TypeScript</span>
        </div>
        <p className="tip">
          Please try pressing <code>F12</code> to open the devTool
        </p>
        <div className="actions">
          <div className="action">
            <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
              Documentation
            </a>
          </div>
          <div className="action">
            <a
              target="_blank"
              rel="noreferrer"
              onClick={() => fileSystemAdapter.createDirectory('best')}
            >
              Send IPC
            </a>
          </div>
        </div>

        <Versions></Versions>
      </ThemeProvider>
    </>
  )
}

export default App
