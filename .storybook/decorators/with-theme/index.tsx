import React from "react";

import { primaryTheme } from "./../../../src/renderer/src/front-shared/styles/theme/primary/primary";
import { StoryFn } from "@storybook/react";
import { ThemeProvider } from "styled-components";

export const withTheme = (Story: StoryFn) => {
  return (
    <ThemeProvider theme={primaryTheme}>
      <Story />
    </ThemeProvider>
  );
};
