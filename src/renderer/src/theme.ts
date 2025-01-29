import { createTheme } from '@mui/material/styles'

export const primaryTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212', // Цвет основного фона
      paper: '#1E1E1E' // Цвет для Paper и подобных компонентов
    }
  }
})
