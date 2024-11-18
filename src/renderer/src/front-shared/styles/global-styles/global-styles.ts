import { css } from '@emotion/react'
import { fonts } from './fonts'

export const globalStyles = css`
  ${fonts}

  * {
    margin: 0;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
  }

  *::before,
  *::after {
    box-sizing: border-box;
  }

  #root {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
  }
`
