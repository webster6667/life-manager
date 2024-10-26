import React from "react";
import { BrowserRouter } from "react-router-dom";

import { StoryFn } from "@storybook/react";

export const withRouter = (StoryComponent: StoryFn) => {
  return (
    <>
      <BrowserRouter>
        <StoryComponent />
      </BrowserRouter>
    </>
  );
};
