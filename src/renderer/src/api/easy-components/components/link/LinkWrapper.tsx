import { observer } from 'mobx-react-lite'
import React from 'react'
import { useLinkUserInteraction } from '@easy-diagram/hooks/userInteractions/useLinkUserInteraction'
import { LinkCreationState } from '@easy-diagram/states/linkCreationState'
import { LinkState } from '@easy-diagram/states/linkState'

export const LinkWrapper = observer<{ link: LinkState | LinkCreationState }>(({ link }) => {
  const { bind } = useLinkUserInteraction(link)

  return (
    <g>
      <link.componentDefinition.component
        bind={bind}
        entity={link}
        settings={link.componentDefinition.settings}
      />
    </g>
  )
})
