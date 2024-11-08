import { HTMLProps, ReactNode } from "react";

export interface PrimaryAccordionProps
  extends Omit<HTMLProps<HTMLDivElement>, "title"> {
  title: string | (() => ReactNode);
  chip?: string;
}
