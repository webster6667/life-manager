import '@remirror/styles/all.css'

import { FC, PropsWithChildren, useCallback } from 'react'
import jsx from 'refractor/lang/jsx.js'
import typescript from 'refractor/lang/typescript.js'
import { ExtensionPriority } from 'remirror'
import {
  BlockquoteExtension,
  BoldExtension,
  BulletListExtension,
  CodeBlockExtension,
  CodeExtension,
  HardBreakExtension,
  HeadingExtension,
  ItalicExtension,
  LinkExtension,
  ListItemExtension,
  MarkdownExtension,
  OrderedListExtension,
  PlaceholderExtension,
  StrikeExtension,
  TableExtension,
  TrailingNodeExtension,
  TaskListExtension
} from 'remirror/extensions'
import { i18nFormat } from '@remirror/i18n'
import { EditorComponent, Remirror, ThemeProvider, useRemirror } from '@remirror/react'
import { AllStyledComponent } from '@remirror/styles/emotion'

import type { CreateEditorStateProps } from 'remirror'
import type { RemirrorProps, UseThemeProps } from '@remirror/react'

export interface ReactEditorProps
  extends Pick<CreateEditorStateProps, 'stringHandler'>,
    Pick<
      RemirrorProps,
      | 'initialContent'
      | 'editable'
      | 'autoFocus'
      | 'hooks'
      | 'i18nFormat'
      | 'locale'
      | 'supportedLocales'
    > {
  placeholder?: string
  theme?: UseThemeProps['theme']
}

export interface MarkdownEditorProps extends Partial<Omit<ReactEditorProps, 'stringHandler'>> {
  value: string
  onChange: (newValue: string) => void
  readonly?: boolean
}

/**
 * The editor which is used to create the annotation. Supports formatting.
 */
export const MarkdownEditor: FC<PropsWithChildren<MarkdownEditorProps>> = ({
  placeholder,
  children,
  theme,
  value,
  onChange,
  readonly = false
}) => {
  const extensions = useCallback(
    () => [
      new LinkExtension({ autoLink: true }),
      new PlaceholderExtension({ placeholder }),
      new BoldExtension(),
      new StrikeExtension(),
      new ItalicExtension(),
      new HeadingExtension(),
      new BlockquoteExtension(),
      new BulletListExtension({ enableSpine: true }),
      new OrderedListExtension(),
      new ListItemExtension({
        priority: ExtensionPriority.High,
        enableCollapsible: true
      }),
      new TaskListExtension(),
      new CodeExtension(),
      new CodeBlockExtension({ supportedLanguages: [jsx, typescript] }),
      new TrailingNodeExtension(),
      new TableExtension(),
      new MarkdownExtension({ copyAsMarkdown: false }),
      /**
       * `HardBreakExtension` allows us to create a newline inside paragraphs.
       * e.g. in a list item
       */
      new HardBreakExtension()
    ],
    [placeholder]
  )

  const { manager } = useRemirror({
    extensions,
    stringHandler: 'markdown',
    content: value
  })

  return (
    <AllStyledComponent>
      <ThemeProvider theme={theme}>
        <Remirror
          manager={manager}
          initialContent={value}
          onChange={({ state }) => {
            const markdownExtension = manager.getExtension(MarkdownExtension)
            const markdown = markdownExtension?.getMarkdown(state) // Конвертация в Markdown
            if (markdown && onChange) {
              onChange(markdown) // Обновляем состояние
            }
          }}
          i18nFormat={i18nFormat}
          autoFocus={false}
          editable={!readonly}
        >
          <EditorComponent />
          {children}
        </Remirror>
      </ThemeProvider>
    </AllStyledComponent>
  )
}
