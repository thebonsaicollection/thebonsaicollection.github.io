import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

function MainLandFloor({
  onFloorReady,
  onObjectSelect,
  onBackToGallery,
}) {
  const { scene } = useGLTF(
    "/models/TBC_MainLand_01_Floor_01.glb"
  );

  useEffect(() => {
    scene.scale.setScalar(0.001);

    scene.updateMatrixWorld(true);

    const spawn =
      scene.getObjectByName(
        "TBC_Spawn_MainLand_01_Floor_01"
      );

    const backButton =
      scene.getObjectByName(
        "TBC_Button_Back_MainLand_01_Floor_01"
      );

    const vitrines = [];

    scene.traverse((object) => {
      if (
        object.name.startsWith(
          "TBC_Vitrine_MainLand_01_Floor_01_"
        )
      ) {
        vitrines.push(object);
      }
    });

    console.log(
      "TBC: MainLand Floor 01 cargado"
    );

    console.log(
      "Spawn:",
      spawn
    );

    console.log(
      "Back Button:",
      backButton
    );

    console.log(
      "Vitrines:",
      vitrines
    );

    onFloorReady({
      scene,
      spawn,
      backButton,
      vitrines,
    });
  }, [
    scene,
    onFloorReady,
  ]);

  const findObjectByName = (
    object,
    targetName
  ) => {
    let current = object;

    while (current) {
      if (
        current.name === targetName
      ) {
        return current;
      }

      current = current.parent;
    }

    return null;
  };

  return (
    <primitive
      object={scene}
      onClick={(event) => {
        event.stopPropagation();

        console.log(
          "MainLand CLICK:",
          event.object.name
        );

        const backButton =
          findObjectByName(
            event.object,
            "TBC_Button_Back_MainLand_01_Floor_01"
          );

        if (backButton) {
          console.log(
            "TBC: BOTON BACK MAINLAND FLOOR 01 DETECTADO"
          );

          onBackToGallery();

          return;
        }

        onObjectSelect(
          event.object
        );
      }}
    />
  );
}

useGLTF.preload(
  "/models/TBC_MainLand_01_Floor_01.glb"
);

export default MainLandFloor;