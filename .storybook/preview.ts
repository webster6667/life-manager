import { customViewports } from "./const";
import {
  withGlobalStyle,
  withRouter,
  withTheme,
} from "./decorators";
import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: { viewports: customViewports },
  },
  decorators: [withTheme, withGlobalStyle, withRouter]
};

export default preview;
