// @flow weak

import AddLocationIcon from "@mui/icons-material/AddLocation";
import SidebarBoxContainer from "../SidebarBoxContainer";
import getTimeString from "../KeyframeTimeline/get-time-string";
import TrashIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import { MainLayoutVideoAnnotationState } from "../MainLayout/types.ts";
import { useAppTheme } from "../Theme";

const KeyframeRow = styled("div")(({ theme }) => ({
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  padding: 8,
  fontSize: 14,
  color: theme.palette.text.primary,
  width: "100%",
  "&.current": {
    backgroundColor: theme.palette.action.selected,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "& .time": {
    flexGrow: 1,
    fontWeight: "bold",
    "& .regionCount": {
      marginLeft: 8,
      fontWeight: "normal",
      color: theme.palette.text.secondary,
    },
  },
  "& .trash": {
    "& .icon": {
      fontSize: 18,
      color: theme.palette.text.secondary,
      transition: "transform 80ms",
      "&:hover": {
        color: theme.palette.text.primary,
        transform: "scale(1.25,1.25)",
      },
    },
  },
}));

interface KeyframesSelectorSidebarBoxProps {
  currentVideoTime?: number;
  keyframes: MainLayoutVideoAnnotationState["keyframes"];
  onChangeVideoTime: (time: number) => void;
  onDeleteKeyframe: (time: number) => void;
}
const KeyframesSelectorSidebarBox = ({
  currentVideoTime,
  keyframes,
  onChangeVideoTime,
  onDeleteKeyframe,
}: KeyframesSelectorSidebarBoxProps) => {
  const keyframeTimes = Object.keys(keyframes).map((t) => parseInt(t));
  const theme = useAppTheme();

  return (
    <ThemeProvider theme={theme}>
      <SidebarBoxContainer
        title="Keyframes"
        icon={
          <AddLocationIcon style={{ color: theme.palette.text.primary }} />
        }
        expandedByDefault
      >
        {keyframeTimes.map((t) => (
          <KeyframeRow
            key={t}
            className={currentVideoTime === t ? "current" : ""}
            onClick={() => onChangeVideoTime(t)}
          >
            <div className="time">
              {getTimeString(t, 2)}
              <span className="regionCount">
                ({(keyframes[t]?.regions || []).length})
              </span>
            </div>
            <div className="trash">
              <TrashIcon
                onClick={(e) => {
                  onDeleteKeyframe(t);
                  e.stopPropagation();
                }}
                className="icon"
              />
            </div>
          </KeyframeRow>
        ))}
      </SidebarBoxContainer>
    </ThemeProvider>
  );
};

export default KeyframesSelectorSidebarBox;
