import { IUseStylingOptions, useStyling } from '@easy-diagram/hooks/useStyling'
import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'
import type { ILinkVisualComponentProps } from '@easy-diagram/states/linksSettings'
import type { IComponentDefinition } from '@easy-diagram/states/visualComponentState'

function shiftPath(d, dx, dy) {
  return d.replace(
    /([MC])\s*([\d.]+)\s+([\d.]+)|([\d.]+)\s+([\d.]+)/g,
    (match, cmd, x1, y1, x2, y2) => {
      if (cmd) {
        // Первые координаты после команды (например, "M 682.75 402")
        return `${cmd} ${parseFloat(x1) + dx} ${parseFloat(y1) + dy}`
      } else {
        // Обычные координаты (например, "742.75 402")
        return `${parseFloat(x2) + dx} ${parseFloat(y2) + dy}`
      }
    }
  )
}

export const LinkDefault: React.FC<ILinkVisualComponentProps<ILinkDefaultSettings>> = observer(
  ({ entity, settings, offset = {}, bind }) => {
    const { left = 0, top = 0 } = offset
    const mainStylingOptions = useMemo<IUseStylingOptions>(
      () => ({
        removeDefaultClasses: settings?.removeDefaultClasses,
        baseState: 'base',
        classes: settings?.mainLine?.classes,
        defaultClasses: defaultLinkMainLineClasses,
        style: settings?.mainLine?.style,
        spareStates: { 'selected-hovered': ['selected', 'hovered'] }
      }),
      [settings]
    )

    const secondaryStylingOptions = useMemo<IUseStylingOptions>(
      () => ({
        removeDefaultClasses: settings?.removeDefaultClasses,
        baseState: 'base',
        classes: settings?.secondaryLine?.classes,
        defaultClasses: defaultLinkSecondaryLineClasses,
        style: settings?.secondaryLine?.style,
        spareStates: { 'selected-hovered': ['selected', 'hovered'] }
      }),
      [settings]
    )

    let state = 'base'
    if (entity?.selected && entity?.hovered) state = 'selected-hovered'
    else if (entity?.selected) state = 'selected'
    else if (entity?.hovered) state = 'hovered'

    const mainStyling = useStyling(mainStylingOptions, state)
    const secondaryStyling = useStyling(secondaryStylingOptions, state)

    if (!entity?.path) return null

    return (
      <g>
        <path
          // d={entity.path.svgPath}
          d={shiftPath(entity.path.svgPath, -Math.abs(left), -Math.abs(top))}
          className={mainStyling.className}
          style={mainStyling.style}
        />
        <path
          // d={entity.path.svgPath}
          d={shiftPath(entity.path.svgPath, -Math.abs(left), -Math.abs(top))}
          className={secondaryStyling.className}
          style={secondaryStyling.style}
          {...bind()}
        />
      </g>
    )
  }
)

export interface ILineStyling {
  classes?: LinkDefaultSettingsByStates<string[]>
  style?: LinkDefaultSettingsByStates<React.CSSProperties>
}
export interface ILinkDefaultSettings {
  removeDefaultClasses?: true
  mainLine?: ILineStyling
  secondaryLine?: ILineStyling
}

export type LinkDefaultState = 'base' | 'hovered' | 'selected' | 'selected-hovered'
export type LinkDefaultSettingsByStates<TValue> = {
  [key in LinkDefaultState]?: TValue
}

export const defaultLinkMainLineClasses: LinkDefaultSettingsByStates<string[]> = {
  base: ['react_fast_diagram_LinkDefault_Line'],
  hovered: ['react_fast_diagram_LinkDefault_Line_Hovered'],
  selected: ['react_fast_diagram_LinkDefault_Line_Selected']
}

export const defaultLinkSecondaryLineClasses: LinkDefaultSettingsByStates<string[]> = {
  base: ['react_fast_diagram_LinkDefault_Line', 'react_fast_diagram_LinkDefault_SecondaryLine'],
  hovered: [
    'react_fast_diagram_LinkDefault_Line_Hovered',
    'react_fast_diagram_LinkDefault_SecondaryLine_Hovered'
  ],
  'selected-hovered': [
    'react_fast_diagram_LinkDefault_Line_Selected',
    'react_fast_diagram_LinkDefault_SecondaryLine_Hovered'
  ]
}

export function createLinkDefault(
  settings?: ILinkDefaultSettings
): IComponentDefinition<ILinkVisualComponentProps, Partial<ILinkDefaultSettings>> {
  return {
    component: LinkDefault,
    settings: settings
  }
}
