import styled from '@emotion/styled'

export const HeaderPlash = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 35px;
  background-color: #363636;
  color: #ffffff;
  padding: 0 10px;
  -webkit-app-region: drag; /* Делаем область перетаскиваемой */
  z-index: 999999;
`
