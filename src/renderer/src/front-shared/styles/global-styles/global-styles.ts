import { css } from '@emotion/react'
import { fonts } from './fonts'

export const globalStyles = css`
  ${fonts}

  * {
    margin: 0;
    box-sizing: border-box;
  }

  html,
  body {
    height: 100%;
    max-height: 100%;
  }

  body {
    display: flex;
    flex-direction: column;
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
    height: 100%;
    padding-top: 35px;
  }

  /* Стили для самого скроллбара */
  ::-webkit-scrollbar {
    width: 8px; /* Толщина вертикального скроллбара */
    height: 8px; /* Толщина горизонтального скроллбара */
  }

  /* Цвет трека (фона под скроллбаром) */
  ::-webkit-scrollbar-track {
    background-color: #1e1e1e; /* Темный цвет трека */
    border-radius: 4px;
  }

  /* Цвет "ползунка" */
  ::-webkit-scrollbar-thumb {
    background-color: #555; /* Темно-серый ползунок */
    border-radius: 4px; /* Закругленные края */
  }

  /* Цвет "ползунка" при наведении */
  ::-webkit-scrollbar-thumb:hover {
    background-color: #777; /* Светло-серый ползунок при наведении */
  }

  /* Цвет "ползунка" при нажатии */
  ::-webkit-scrollbar-thumb:active {
    background-color: #999; /* Ещё светлее при нажатии */
  }

  /* Настройки для Firefox */
  * {
    scrollbar-color: #555 #1e1e1e; /* Цвет "ползунка" и трека */
    scrollbar-width: thin; /* Узкий скроллбар */
  }
`
