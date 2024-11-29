import * as React from 'react'

import styled from '@emotion/styled'
import { css } from '@emotion/react'

import {
  CanvasEngine,
  SmartLayerWidget,
  TransformLayerWidget
} from '@projectstorm/react-canvas-core'
import { ReactNode, useState } from 'react'

export interface DiagramProps {
  engine: CanvasEngine
  className?: string
}

namespace S {
  export const Canvas = styled.div`
    position: relative;
    cursor: move;
    overflow: hidden;
  `
}

namespace S {
  const shared = css`
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    pointer-events: none;
    transform-origin: 0 0;
    width: 100%;
    height: 100%;
    overflow: visible;
  `

  export const DivLayer = styled.div`
    ${shared}
  `

  export const SvgLayer = styled.svg`
    ${shared}
  `
}

const DraggableWrapper = ({ children }: { children: ReactNode }) => {
  const [isDragging, setDragging] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })

  const onMouseDown = (event: React.MouseEvent) => {
    setDragging(true)
    setStartPos({ x: event.clientX, y: event.clientY })
    event.stopPropagation()

    console.log('test')
  }

  const onMouseMove = (event: React.MouseEvent) => {
    if (isDragging) {
      const dx = event.clientX - startPos.x
      const dy = event.clientY - startPos.y
      setStartPos({ x: event.clientX, y: event.clientY })
    }

    event.stopPropagation()
  }

  const onMouseUp = () => {
    setDragging(false)
  }

  return (
    <div
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: startPos.x,
        top: startPos.y
      }}
    >
      {children}
    </div>
  )
}

export class CanvasWidget extends React.Component<DiagramProps> {
  ref: React.RefObject<HTMLDivElement>
  keyUp: any
  keyDown: any
  canvasListener: any

  constructor(props: DiagramProps) {
    super(props)

    this.ref = React.createRef()
    this.state = {
      action: null,
      diagramEngineListener: null
    }
  }

  componentWillUnmount() {
    this.props.engine.deregisterListener(this.canvasListener)
    this.props.engine.setCanvas(null)

    document.removeEventListener('keyup', this.keyUp)
    document.removeEventListener('keydown', this.keyDown)
  }

  registerCanvas() {
    this.props.engine.setCanvas(this.ref.current)
    this.props.engine.iterateListeners((list) => {
      list.rendered && list.rendered()
    })
  }

  componentDidUpdate() {
    this.registerCanvas()
  }

  componentDidMount() {
    this.canvasListener = this.props.engine.registerListener({
      repaintCanvas: () => {
        this.forceUpdate()
      }
    })

    this.keyDown = (event) => {
      this.props.engine.getActionEventBus().fireAction({ event })
    }
    this.keyUp = (event) => {
      this.props.engine.getActionEventBus().fireAction({ event })
    }

    document.addEventListener('keyup', this.keyUp)
    document.addEventListener('keydown', this.keyDown)
    this.registerCanvas()
  }

  render() {
    const engine = this.props.engine
    const model = engine.getModel()
    const layers = model.getLayers()
    const rootLinkLayer = layers[0]
    const rootNodeLayer = layers[1]
    const childLayers = layers.slice(2)

    return (
      <S.Canvas
        className={this.props.className}
        ref={this.ref}
        onWheel={(event) => {
          this.props.engine.getActionEventBus().fireAction({ event })
        }}
        onMouseDown={(event) => {
          this.props.engine.getActionEventBus().fireAction({ event })
        }}
        onMouseUp={(event) => {
          this.props.engine.getActionEventBus().fireAction({ event })
        }}
        onMouseMove={(event) => {
          this.props.engine.getActionEventBus().fireAction({ event })
        }}
        onTouchStart={(event) => {
          this.props.engine.getActionEventBus().fireAction({ event })
        }}
        onTouchEnd={(event) => {
          this.props.engine.getActionEventBus().fireAction({ event })
        }}
        onTouchMove={(event) => {
          this.props.engine.getActionEventBus().fireAction({ event })
        }}
      >
        {/*<TransformLayerWidget layer={rootLinkLayer} key={rootLinkLayer.getID()}>*/}
        {/*  <SmartLayerWidget*/}
        {/*    layer={rootLinkLayer}*/}
        {/*    engine={this.props.engine}*/}
        {/*    key={rootLinkLayer.getID()}*/}
        {/*  />*/}
        {/*</TransformLayerWidget>*/}
        {/*<TransformLayerWidget layer={rootNodeLayer} key={rootNodeLayer.getID()}>*/}
        {/*  <SmartLayerWidget*/}
        {/*    layer={rootNodeLayer}*/}
        {/*    engine={this.props.engine}*/}
        {/*    key={rootNodeLayer.getID()}*/}
        {/*  />*/}

        {/*  <DraggableWrapper>*/}
        {/*    {childLayers.map((layer) =>*/}
        {/*      layer.getOptions().isSvg ? (*/}
        {/*        <S.SvgLayer key={layer.getID()}>*/}
        {/*          <SmartLayerWidget layer={layer} engine={this.props.engine} key={layer.getID()} />*/}
        {/*        </S.SvgLayer>*/}
        {/*      ) : (*/}
        {/*        <S.DivLayer key={layer.getID()}>*/}
        {/*          <SmartLayerWidget layer={layer} engine={this.props.engine} key={layer.getID()} />*/}
        {/*        </S.DivLayer>*/}
        {/*      )*/}
        {/*    )}*/}
        {/*  </DraggableWrapper>*/}
        {/*</TransformLayerWidget>*/}

        {model.getLayers().map((layer) => {
          return (
            <TransformLayerWidget layer={layer} key={layer.getID()}>
              <SmartLayerWidget layer={layer} engine={this.props.engine} key={layer.getID()} />
            </TransformLayerWidget>
          )
        })}
      </S.Canvas>
    )
  }
}
