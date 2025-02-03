import React, { FC } from 'react'

import { ReactComponent as ArrowDown } from './../../../../assets/img/icons/arrows/arrow-down.svg'
import { useSwitch } from '././../../../hooks/use-switch/index'
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
