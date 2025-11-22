import HeaderButton from "../HeaderButton/index.js";
import Box from "@mui/material/Box";
import { styled, ThemeProvider } from "@mui/material/styles";
import { ReactNode } from "react";
import { useAppTheme } from "../../Theme";

const Container = styled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  alignItems: "center",
  flexShrink: 1,
  boxSizing: "border-box",
}));

interface HeaderProps {
  leftSideContent?: ReactNode;
  hideHeaderText?: boolean;
  items: Array<{ name: string }>;
  onClickItem: (item: { name: string }) => void;
}

export const Header = ({
  leftSideContent = null,
  hideHeaderText = false,
  items,
  onClickItem,
}: HeaderProps) => {
  const theme = useAppTheme();
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Box flexGrow={1}>{leftSideContent}</Box>
        {items.map((item, index) => (
          <HeaderButton
            key={`${item.name}-${index}`}
            hideText={hideHeaderText}
            onClick={() => onClickItem(item)}
            {...item}
          />
        ))}
      </Container>
    </ThemeProvider>
  );
};

export default Header;
