import { Image, MainLayoutState, VideoImage } from "../../MainLayout/types";
import { getIn } from "../../utils/nested-dict-access";

export default (state: MainLayoutState) => {
  let currentImageIndex: number | null = null;
  let pathToActiveImage: string[] = [];
  let activeImage: Image | VideoImage | null = null;
  if (state.annotationType === "image") {
    currentImageIndex = state.selectedImage ?? null;
    if (currentImageIndex === -1 || currentImageIndex === null) {
      currentImageIndex = null;
      activeImage = null;
    } else {
      pathToActiveImage = ["images", currentImageIndex.toString()];
      activeImage = getIn(state, pathToActiveImage);
    }
  } else if (state.annotationType === "video") {
    pathToActiveImage = ["keyframes", `${state.currentVideoTime || 0}`];
    activeImage = getIn(state, pathToActiveImage) || null;
  }
  return { currentImageIndex, pathToActiveImage, activeImage };
};
