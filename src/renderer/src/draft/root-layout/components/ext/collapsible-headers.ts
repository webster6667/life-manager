import { NodeExtension } from '@remirror/core'
import { NodeSpecOverride, ApplySchemaAttributes, NodeExtensionSpec } from '@remirror/core-types'

export class CollapsibleHeadingExtension extends NodeExtension {
  get name() {
    return 'collapsibleHeading'
  }

  static disableExtraAttributes = true

  addAttributes() {
    return {
      level: {
        default: 1,
        parseDOM: (dom) => parseInt(dom.getAttribute('data-level') || '1'),
        toDOM: (attr) => attr
      },
      collapsed: {
        default: false,
        parseDOM: (dom) => dom.getAttribute('data-collapsed') === 'true',
        toDOM: (attr) => (attr ? 'true' : 'false')
      }
    }
  }

  createNodeSpec(extra: ApplySchemaAttributes, override: NodeSpecOverride): NodeExtensionSpec {
    return {
      content: 'block*',
      group: 'block',
      defining: true,
      attrs: {
        level: { default: 1 },
        collapsed: { default: false }
      },
      parseDOM: [
        {
          tag: 'div.collapsible-heading',
          getAttrs: (dom: HTMLElement) => ({
            level: parseInt(dom.getAttribute('data-level') || '1'),
            collapsed: dom.getAttribute('data-collapsed') === 'true'
          })
        }
      ],
      toDOM: (node) => [
        'div',
        extra.dom({
          class: `collapsible-heading level-${node.attrs.level}`,
          'data-level': node.attrs.level,
          'data-collapsed': node.attrs.collapsed
        }),
        ['button', { class: 'toggle-button' }, node.attrs.collapsed ? '+' : '-'],
        ['div', { class: 'content' }, 0]
      ],
      ...override
    }
  }
}
