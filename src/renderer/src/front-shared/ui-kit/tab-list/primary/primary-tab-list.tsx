import React, { FC, useState } from 'react'

import { TabList, Tab, ContentWrapper, Wrapper } from './styles'
import { PrimaryTabListProps } from './types'

export const PrimaryTabList: FC<PrimaryTabListProps> = ({ items, size = 'md', ...props }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  const tabClickHandler = (tabIndex) => {
    setActiveTabIndex(tabIndex)
  }

  return (
    <Wrapper>
      <TabList size={size} {...props}>
        {items.map((tab, index) => (
          <Tab
            onClick={() => tabClickHandler(index)}
            isActive={index === activeTabIndex}
            key={tab.title}
          >
            {tab.title}
          </Tab>
        ))}
      </TabList>
      <ContentWrapper>{items[activeTabIndex].content}</ContentWrapper>
    </Wrapper>
  )
}
