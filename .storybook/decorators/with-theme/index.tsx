import React from "react";

import { primaryTheme } from "@front-shared/styles/theme";
import { StoryFn } from "@storybook/react";
import { ThemeProvider } from "styled-components";

export const withTheme = (Story: StoryFn) => {
  return (
    <ThemeProvider theme={primaryTheme}>
      <Story />
    </ThemeProvider>
  );
};
