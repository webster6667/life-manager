import { createGlobalStyle } from 'styled-components'
import {Fonts} from './fonts'

export const GlobalStyles = createGlobalStyle`
  
    ${Fonts}
    
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        margin: 0;
        padding: 0;
    }

    *::before, *::after {
        box-sizing: border-box;
    }
    
    #root {
        display: flex;
        flex-direction: column;
    }

`
