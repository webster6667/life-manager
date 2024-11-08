import React, { FC } from "react";

import { Meta } from "@storybook/react";
import { StoryObj } from "@storybook/react";

import { PrimaryAccordion } from "./primary-accordion";
import { PrimaryAccordionProps } from "./types";

export interface StoryProps {}

type LayoutProps = PrimaryAccordionProps & StoryProps;

type StoryInstanceProps = StoryObj<LayoutProps>;

export default {
  title: "UI kit/Accordion/Primary/PrimaryAccordion",
  component: PrimaryAccordion,
  args: {},
} as Meta<typeof PrimaryAccordion>;

export const Default: FC<LayoutProps> = ({ ...args }) => {
  return (
    <PrimaryAccordion {...args} title={"accordion"} chip="1">
      content
    </PrimaryAccordion>
  );
};
