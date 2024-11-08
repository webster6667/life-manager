import React, { FC } from "react";

import { Meta } from "@storybook/react";
import { StoryObj } from "@storybook/react";

import { PrimaryTabList } from "./primary-tab-list";
import { PrimaryTabListProps } from "./types";

export interface StoryProps {}

type LayoutProps = PrimaryTabListProps & StoryProps;

type StoryInstanceProps = StoryObj<LayoutProps>;

export default {
  title: "UI kit/TabList/Primary/PrimaryTabList",
  component: PrimaryTabList,
  args: {
    items: [
      { title: "tab 1", content: <div>tab content 1</div> },
      { title: "tab 2", content: <div>tab content 2</div> },
      { title: "tab 3", content: <div>tab content 3</div> },
    ],
  },
} as Meta<typeof PrimaryTabList>;

export const Default: FC<LayoutProps> = ({ ...args }) => {
  return <PrimaryTabList {...args} />;
};
