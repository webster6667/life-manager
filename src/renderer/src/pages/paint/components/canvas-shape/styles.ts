import styled from '@emotion/styled'

export const Port = styled.div`
  width: 16px;
  height: 16px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 1);
  }
`

export const ResizeHandle = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: red;
  bottom: 0;
  right: 0;
  cursor: nwse-resize;
`

export const DiamondContainer = styled.div`
  position: relative;
`

export const Label = styled.div`
  user-select: none;
  pointer-events: auto;
`
