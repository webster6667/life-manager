import styled from '@emotion/styled'

export const EditorContainer = styled.div<{inFocused?: boolean}>`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 9;

  & > div,
  .remirror-theme,
  .remirror-editor-wrapper,
  .remirror-editor {
    width: 100%;
    height: 100%;
    min-height: auto !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }

  .remirror-editor {
    overflow: auto !important;
  }

  .remirror-editor-wrapper {
    padding-top: 0;
    overflow-y: hidden !important;
  }

  .remirror-editor {
    color: white;
  }

  &.align_center .remirror-editor {
    display: flex;
    justify-content: center;
    align-items: center;
  }

`


export const NodeContainer = styled.div<{inFocused?: boolean}>`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  & > svg {
    display: none;
    opacity: 0;
  }

  &.circle {
    border-radius: 50%;
  }

  &.parallelogram {
    transform: skewX(-20deg);
  }

  &.rhomb {
    background: transparent;
  }

  &.capsule {
    border-radius: 1000px;
  }

  &.rhomb {
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 141.42135624 141.42135624' preserveAspectRatio='none'%3E%3Cstyle%3E rect %7B transform-origin: center; transform: rotate(45deg) scale(1.05); %7D %3C/style%3E%3Crect rx='8' x='20.71067812' y='20.71067812' width='100' height='100' /%3E%3C/svg%3E");
    background: rgb(126, 126, 126);
  }

  &.rhomb > svg {
    display: block;
    width: 100%;
    height: 100%;
    opacity: 1;
  }

  &.c0c0c0 {
    border-color: #c676ff !important;
    outline-color: #c676ff !important;
  }

`
