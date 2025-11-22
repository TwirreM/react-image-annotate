// @flow

import { memo, ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { SidebarBox } from "../workspace/SidebarBox";
import { useAppTheme } from "../Theme";

interface SidebarBoxContainerProps {
  icon?: ReactNode;
  title: string;
  children: ReactNode;
  noScroll?: boolean;
  expandedByDefault?: boolean;
}

export const SidebarBoxContainer = ({
  icon,
  title,
  children,
}: SidebarBoxContainerProps) => {
  const theme = useAppTheme();
  return (
    <ThemeProvider theme={theme}>
      <SidebarBox icon={icon} title={title}>
        {children}
      </SidebarBox>
    </ThemeProvider>
  );
};

export default memo(
  SidebarBoxContainer,
  (prev, next) => prev.title === next.title && prev.children === next.children
);
