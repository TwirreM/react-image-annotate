import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Annotator } from "./lib.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Annotator
            allowComments
            hideClone
            onExit={async (_state) => console.log("onExit")}
            regionClsList={["bike", "person"]}
            regionTagList={["face-occluded"]}
            showTags={true}
            enabledTools={["select", "create-box", "create-polygon"]}
            images={[
                {
                    src: "https://picsum.photos/1200/800",
                    name: "Sample Image",
                },
            ]}
            selectedImage={0}
        />
    </StrictMode>
);
