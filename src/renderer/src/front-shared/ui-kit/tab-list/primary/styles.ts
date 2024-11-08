import { sizeProps } from "@ui-kit/tab-list/primary/const";
import styled from "styled-components";

import { PrimaryTabListProps, TabProps } from "./types";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Tab = styled.div<TabProps>`
  display: flex;

  border-style: solid;
  border-bottom-color: ${({ theme, isActive }) =>
    isActive ? theme.palette.colors.primary : "transparent"};
  text-transform: uppercase;
  cursor: ${({ isActive }) => (isActive ? "auto" : "pointer")};

  &:hover {
    background: ${({ isActive, theme }) =>
      isActive ? "transparent" : theme.palette.colors.secondary};
    color: ${({ isActive, theme }) =>
      isActive ? "inherit" : theme.palette.fonts.tertiary};
  }
`;

export const TabList = styled.div<Pick<PrimaryTabListProps, "size">>`
  display: flex;

  ${Tab} {
    border-width: 0 0 ${({ size }) => sizeProps.borderWidth[size]} 0;
    font-size: ${({ size }) => sizeProps.fontSize[size]};
    padding: ${({ size }) => sizeProps.padding[size]};
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 20px;
`;
