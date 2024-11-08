import { HTMLProps, ReactNode } from "react";

export interface PrimaryTabListProps
  extends Omit<HTMLProps<HTMLDivElement>, "size"> {
  size?: "md" | "lg";
  items: { content: ReactNode; title: string }[];
}

export interface TabProps {
  isActive?: boolean;
}
