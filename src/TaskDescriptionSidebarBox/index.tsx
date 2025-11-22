// @flow

import { memo } from "react";
import SidebarBoxContainer from "../SidebarBoxContainer";
import DescriptionIcon from "@mui/icons-material/Description";
import { styled, ThemeProvider } from "@mui/material/styles";
import Markdown from "react-markdown";
import { useAppTheme } from "../Theme";

const MarkdownContainer = styled("div")(({ theme }) => ({
  paddingLeft: 16,
  paddingRight: 16,
  fontSize: 12,
  color: theme.palette.text.primary,
  "& h1": { fontSize: 18 },
  "& h2": { fontSize: 14 },
  "& h3": { fontSize: 12 },
  "& h4": { fontSize: 12 },
  "& h5": { fontSize: 12 },
  "& h6": { fontSize: 12 },
  "& p": { fontSize: 12 },
  "& a": {},
  "& img": { width: "100%" },
}));

export const TaskDescriptionSidebarBox = ({
  description,
}: {
  description?: string;
}) => {
  const theme = useAppTheme();
  return (
    <ThemeProvider theme={theme}>
      <SidebarBoxContainer
        title="Task Description"
        icon={<DescriptionIcon style={{ color: theme.palette.text.primary }} />}
        expandedByDefault={!(description && description !== "")}
      >
        <MarkdownContainer>
          <Markdown children={description} />
        </MarkdownContainer>
      </SidebarBoxContainer>
    </ThemeProvider>
  );
};

export default memo(TaskDescriptionSidebarBox);
