// @flow

import type {
  Action,
  MainLayoutImageAnnotationState,
} from "../../MainLayout/types";
import getActiveImage from "./get-active-image";
import { setIn } from "../../utils/nested-dict-access.ts";

export default (
  state: MainLayoutImageAnnotationState,
  action: Action
): MainLayoutImageAnnotationState => {
  const { currentImageIndex } = getActiveImage(state);

  switch (action.type) {
    case "IMAGE_OR_VIDEO_LOADED": {
      if (!currentImageIndex) return state;
      return setIn(
        state,
        ["images", currentImageIndex.toString(), "pixelSize"],
        {
          w: action.metadata.naturalWidth,
          h: action.metadata.naturalHeight,
        }
      );
    }
  }
  return state;
};
