import React from "react";

import { GlobalStyles } from "@front-shared/styles/global-styles";
import { StoryBookGlobalStyles } from "@my-storybook/styles/global-styles";
import { StoryFn } from "@storybook/react";

export const withGlobalStyle = (Story: StoryFn) => {
  return (
    <>
      <GlobalStyles />
      <StoryBookGlobalStyles />
      <Story />
    </>
  );
};
