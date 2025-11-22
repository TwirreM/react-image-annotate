import { styled, ThemeProvider } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { iconMapping } from "../icon-mapping.ts";
import { useIconDictionary } from "../icon-dictionary.ts";
import Tooltip from "@mui/material/Tooltip";
import { AnnotatorToolEnum } from "../../MainLayout/types.ts";
import { IconSidebarItem } from "../../types/common.ts";
import { useAppTheme } from "../../Theme";

const Container = styled("div")(({ theme }) => ({
  width: 50,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
  flexShrink: 0,
}));

interface IconSidebarProps {
  items?: Array<IconSidebarItem>;
  onClickItem: (item: { name: string }) => void;
  selectedTools?: Array<AnnotatorToolEnum>;
}

export const IconSidebar = ({
  items = [],
  onClickItem,
  selectedTools = [],
}: IconSidebarProps) => {
  const customIconMapping = useIconDictionary();
  const theme = useAppTheme();
  return (
    <ThemeProvider theme={theme}>
      <Container>
        {items.map((item) => {
          let NameIcon =
            customIconMapping[item.name.toLowerCase()] ||
            iconMapping[item.name.toLowerCase()] ||
            iconMapping["help"];

          const buttonPart = (
            <IconButton
              key={item.name}
              color={
                item.selected ||
                selectedTools.includes(
                  item.name.toLowerCase() as AnnotatorToolEnum
                )
                  ? "primary"
                  : "default"
              }
              disabled={Boolean(item.disabled)}
              onClick={() =>
                item.onClick ? item.onClick(item) : onClickItem(item)
              }
            >
              {<NameIcon />}
            </IconButton>
          );

          if (!item.helperText) return buttonPart;

          return (
            <Tooltip key={item.name} title={item.helperText} placement="right">
              {buttonPart}
            </Tooltip>
          );
        })}
      </Container>
    </ThemeProvider>
  );
};

export default IconSidebar;
