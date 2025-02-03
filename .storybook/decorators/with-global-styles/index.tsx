import React from "react";

import { globalStyles } from "./../../../src/renderer/src/front-shared/styles/global-styles/global-styles";
import { StoryBookGlobalStyles } from "./../../styles/global-styles/index";
import { StoryFn } from "@storybook/react";
import { Global } from '@emotion/react'


export const withGlobalStyle = (Story: StoryFn) => {
  return (
    <>
      <Global styles={globalStyles} />
      <StoryBookGlobalStyles />
      <Story />
    </>
  );
};
