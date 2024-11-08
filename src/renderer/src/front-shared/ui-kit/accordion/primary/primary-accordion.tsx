import React, { FC } from 'react'

import { ReactComponent as ArrowDown } from '@assets/icons/arrow-down_primary.svg'
import { useSwitch } from '@shared-on-frontend/hooks/use-switch'
import { PrimaryChip } from '@ui-kit/chip/primary'

import { Accordion, Header, Title, ContentWrapper } from './styles'
import { PrimaryAccordionProps } from './types'

export const PrimaryAccordion: FC<PrimaryAccordionProps> = ({
  children,
  title,
  chip,
  ...props
}) => {
  const [isOpen, , , switchSection] = useSwitch(false)

  return (
    <Accordion {...props} isOpen={isOpen as boolean}>
      <Header onClick={switchSection}>
        <Title>
          <ArrowDown className="accordion-arrow" />
          {typeof title === 'function' ? title() : title}
        </Title>
        {chip && <PrimaryChip>{chip}</PrimaryChip>}
      </Header>
      {isOpen && <ContentWrapper>{children}</ContentWrapper>}
    </Accordion>
  )
}
