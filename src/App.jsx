import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import * as THREE from "three";

import {
  Canvas,
  useFrame,
  useThree,
} from "@react-three/fiber";

import {
  PointerLockControls,
  useGLTF,
} from "@react-three/drei";

import {
  scanTBCScene,
  printTBCSceneReport,
  getBaseTBCName,
} from "./utils/sceneScanner";

import TradingViewScreen from "./components/TradingViewScreen";
import MainLandFloor from "./components/MainLandFloor";

function GalleryModel({
  onSceneReady,
  onObjectSelect,
  onTVScreenReady,
  onEnterFloor,
  onSaveCamera,
}) {
  const { scene } = useGLTF(
    "/models/gallery.glb"
  );

  const { camera } =
    useThree();

  useEffect(() => {
    scene.scale.setScalar(0.001);

    console.log(
      "TBC: GLB cargado correctamente"
    );

    const scan =
      scanTBCScene(scene);

    printTBCSceneReport(
      scan
    );

    onSceneReady(
      scan
    );

    const tvScreen =
      scene.getObjectByName(
        "TV_Screen"
      );

    if (tvScreen) {
      console.log(
        "TBC: TV_Screen encontrado correctamente"
      );

      console.log(
        "TV_Screen:",
        tvScreen
      );

      onTVScreenReady(
        tvScreen
      );
    } else {
      console.warn(
        "TBC: TV_Screen no encontrado"
      );
    }
  }, [
    scene,
    onSceneReady,
    onTVScreenReady,
  ]);

  const findObjectByName = (
    object,
    targetName
  ) => {
    let current = object;

    while (current) {
      if (
        current.name ===
        targetName
      ) {
        return current;
      }

      current =
        current.parent;
    }

    return null;
  };

  return (
    <primitive
      object={scene}
      onClick={(event) => {
        event.stopPropagation();

        console.log(
          "TBC CLICK:",
          event.object.name
        );

        const floorButton =
          findObjectByName(
            event.object,
            "TBC_Button_MainLand_01_Floor_01"
          );

        if (floorButton) {
          console.log(
            "TBC: BOTON MAINLAND FLOOR 01 DETECTADO"
          );

          onSaveCamera(
            camera
          );

          onEnterFloor();

          return;
        }

        onObjectSelect(
          event.object
        );
      }}
    />
  );
}

function FirstPersonMovement({
  teleportTarget,
  returnCameraTarget,
}) {
  const controls =
    useRef();

  const { camera } =
    useThree();

  const keys =
    useRef({
      forward: false,
      backward: false,
      left: false,
      right: false,
    });

  const lastTeleport =
    useRef(null);

  useEffect(() => {
    const handleKeyDown =
      (event) => {
        if (
          event.code ===
          "KeyW"
        ) {
          keys.current.forward =
            true;
        }

        if (
          event.code ===
          "KeyS"
        ) {
          keys.current.backward =
            true;
        }

        if (
          event.code ===
          "KeyA"
        ) {
          keys.current.left =
            true;
        }

        if (
          event.code ===
          "KeyD"
        ) {
          keys.current.right =
            true;
        }
      };

    const handleKeyUp =
      (event) => {
        if (
          event.code ===
          "KeyW"
        ) {
          keys.current.forward =
            false;
        }

        if (
          event.code ===
          "KeyS"
        ) {
          keys.current.backward =
            false;
        }

        if (
          event.code ===
          "KeyA"
        ) {
          keys.current.left =
            false;
        }

        if (
          event.code ===
          "KeyD"
        ) {
          keys.current.right =
            false;
        }
      };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    window.addEventListener(
      "keyup",
      handleKeyUp
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      window.removeEventListener(
        "keyup",
        handleKeyUp
      );
    };
  }, []);

  useEffect(() => {
    if (
      !teleportTarget ||
      !controls.current
    ) {
      return;
    }

    if (
      lastTeleport.current ===
      teleportTarget
    ) {
      return;
    }

    camera.position.set(
      teleportTarget.x,
      teleportTarget.y,
      teleportTarget.z
    );

    lastTeleport.current =
      teleportTarget;

    console.log(
      "TBC: cámara teletransportada",
      teleportTarget
    );
  }, [
    teleportTarget,
    camera,
  ]);

  useEffect(() => {
    if (
      !returnCameraTarget ||
      !controls.current
    ) {
      return;
    }

    camera.position.copy(
      returnCameraTarget.position
    );

    camera.quaternion.copy(
      returnCameraTarget.quaternion
    );

    camera.updateMatrixWorld(
      true
    );

    lastTeleport.current =
      null;

    console.log(
      "TBC: cámara restaurada en Gallery"
    );
  }, [
    returnCameraTarget,
    camera,
  ]);

  useFrame(
    (state, delta) => {
      if (
        !controls.current?.isLocked
      ) {
        return;
      }

      const speed =
        2.5 * delta;

      if (
        keys.current.forward
      ) {
        controls.current.moveForward(
          speed
        );
      }

      if (
        keys.current.backward
      ) {
        controls.current.moveForward(
          -speed
        );
      }

      if (
        keys.current.left
      ) {
        controls.current.moveRight(
          -speed
        );
      }

      if (
        keys.current.right
      ) {
        controls.current.moveRight(
          speed
        );
      }

      camera.position.y =
        0.9;
    }
  );

  return (
    <PointerLockControls
      ref={controls}
    />
  );
}

function Scene({
  onSceneReady,
  onObjectSelect,
  onTVScreenReady,
  tvScreen,
  showMainLandFloor,
  onFloorReady,
  onFloorObjectSelect,
  teleportTarget,
  returnCameraTarget,
  onEnterFloor,
  onBackToGallery,
  onSaveCamera,
}) {
  return (
    <>
      <ambientLight
        intensity={1.5}
      />

      <directionalLight
        position={[
          10,
          20,
          10,
        ]}
        intensity={2}
      />

      {!showMainLandFloor && (
        <>
          <GalleryModel
            onSceneReady={
              onSceneReady
            }
            onObjectSelect={
              onObjectSelect
            }
            onTVScreenReady={
              onTVScreenReady
            }
            onEnterFloor={
              onEnterFloor
            }
            onSaveCamera={
              onSaveCamera
            }
          />

          <TradingViewScreen
            screenObject={
              tvScreen
            }
          />
        </>
      )}

      {showMainLandFloor && (
        <MainLandFloor
          onFloorReady={
            onFloorReady
          }
          onObjectSelect={
            onFloorObjectSelect
          }
          onBackToGallery={
            onBackToGallery
          }
        />
      )}

      <FirstPersonMovement
        teleportTarget={
          teleportTarget
        }
        returnCameraTarget={
          returnCameraTarget
        }
      />
    </>
  );
}

function App() {
  const [
    sceneData,
    setSceneData,
  ] = useState(null);

  const [
    selectedObject,
    setSelectedObject,
  ] = useState(null);

  const [
    tvScreen,
    setTVScreen,
  ] = useState(null);

  const [
    showMainLandFloor,
    setShowMainLandFloor,
  ] = useState(false);

  const [
    teleportTarget,
    setTeleportTarget,
  ] = useState(null);

  const [
    returnCameraTarget,
    setReturnCameraTarget,
  ] = useState(null);

  const handleSceneReady =
    useCallback(
      (scan) => {
        setSceneData(scan);
      },
      []
    );

  const handleObjectSelect =
    useCallback(
      (object) => {
        setSelectedObject(
          object
        );
      },
      []
    );

  const handleTVScreenReady =
    useCallback(
      (object) => {
        setTVScreen(
          object
        );
      },
      []
    );

  const handleSaveCamera =
    useCallback(
      (camera) => {
        setReturnCameraTarget(
          {
            position:
              camera.position.clone(),
            quaternion:
              camera.quaternion.clone(),
          }
        );

        console.log(
          "TBC: posición Gallery guardada",
          camera.position
        );
      },
      []
    );

  const handleEnterFloor =
    useCallback(() => {
      console.log(
        "TBC: entrando a MainLand 01 Floor 01..."
      );

      setSelectedObject(
        null
      );

      setTeleportTarget(
        null
      );

      setShowMainLandFloor(
        true
      );
    }, []);

  const handleFloorReady =
    useCallback(
      (floorData) => {
        if (!floorData) {
          return;
        }

        console.log(
          "TBC: MainLand Floor 01 listo"
        );

        if (
          floorData.spawn
        ) {
          floorData.spawn.updateWorldMatrix(
            true,
            false
          );

          const position =
            floorData.spawn.getWorldPosition(
              new THREE.Vector3()
            );

          console.log(
            "TBC: Spawn encontrado:",
            position
          );

          setTeleportTarget(
            position
          );
        }
      },
      []
    );

  const handleFloorObjectSelect =
    useCallback(
      (object) => {
        console.log(
          "MainLand Floor 01 object:",
          object.name
        );

        setSelectedObject(
          object
        );
      },
      []
    );

  const handleBackToGallery =
    useCallback(() => {
      console.log(
        "TBC: volviendo al Gallery..."
      );

      setSelectedObject(
        null
      );

      setTeleportTarget(
        null
      );

      setShowMainLandFloor(
        false
      );
    }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Canvas
        camera={{
          position: [
            0,
            0.9,
            5,
          ],
          fov: 75,
          near: 0.1,
          far: 200,
        }}
      >
        <Scene
          onSceneReady={
            handleSceneReady
          }
          onObjectSelect={
            handleObjectSelect
          }
          onTVScreenReady={
            handleTVScreenReady
          }
          tvScreen={
            tvScreen
          }
          showMainLandFloor={
            showMainLandFloor
          }
          onFloorReady={
            handleFloorReady
          }
          onFloorObjectSelect={
            handleFloorObjectSelect
          }
          teleportTarget={
            teleportTarget
          }
          returnCameraTarget={
            returnCameraTarget
          }
          onEnterFloor={
            handleEnterFloor
          }
          onBackToGallery={
            handleBackToGallery
          }
          onSaveCamera={
            handleSaveCamera
          }
        />
      </Canvas>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 12,
          height: 12,
          transform:
            "translate(-50%, -50%)",
          pointerEvents:
            "none",
          zIndex: 20,
        }}
      >
        <div
          style={{
            position:
              "absolute",
            top: 5,
            left: 0,
            width: 3,
            height: 1,
            background:
              "rgba(255,255,255,0.65)",
          }}
        />

        <div
          style={{
            position:
              "absolute",
            top: 5,
            right: 0,
            width: 3,
            height: 1,
            background:
              "rgba(255,255,255,0.65)",
          }}
        />

        <div
          style={{
            position:
              "absolute",
            top: 0,
            left: 5,
            width: 1,
            height: 3,
            background:
              "rgba(255,255,255,0.65)",
          }}
        />

        <div
          style={{
            position:
              "absolute",
            bottom: 0,
            left: 5,
            width: 1,
            height: 3,
            background:
              "rgba(255,255,255,0.65)",
          }}
        />
      </div>

      {sceneData &&
        !showMainLandFloor && (
          <div
            style={{
              position:
                "absolute",
              top: 20,
              left: 20,
              background:
                "rgba(0,0,0,0.75)",
              color: "white",
              padding:
                "15px 18px",
              borderRadius: 10,
              fontFamily:
                "Arial, sans-serif",
              fontSize: 13,
              pointerEvents:
                "none",
              minWidth: 190,
              backdropFilter:
                "blur(8px)",
              zIndex: 10,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight:
                  "bold",
                marginBottom: 10,
              }}
            >
              TBC SCENE
            </div>

            <div>
              Vitrines:{" "}
              {
                sceneData
                  .vitrines
                  .length
              }
            </div>

            <div>
              Floor Buttons:{" "}
              {
                sceneData
                  .floorButtons
                  .length
              }
            </div>

            <div>
              Floors:{" "}
              {
                sceneData
                  .floors
                  .length
              }
            </div>

            <div>
              Doors:{" "}
              {
                sceneData
                  .doors
                  .length
              }
            </div>

            <div>
              Rooms:{" "}
              {
                sceneData
                  .rooms
                  .length
              }
            </div>

            <div>
              Colliders:{" "}
              {
                sceneData
                  .colliders
                  .length
              }
            </div>

            <div
              style={{
                marginTop: 10,
                opacity: 0.7,
              }}
            >
              TV Screen:{" "}
              {tvScreen
                ? "OK"
                : "No encontrado"}
            </div>
          </div>
        )}

      {selectedObject && (
        <div
          style={{
            position:
              "absolute",
            top: 20,
            right: 20,
            background:
              "rgba(0,0,0,0.85)",
            color: "white",
            padding: 20,
            borderRadius: 12,
            width: 260,
            fontFamily:
              "Arial, sans-serif",
            boxShadow:
              "0 10px 40px rgba(0,0,0,0.4)",
            zIndex: 30,
          }}
        >
          <div
            style={{
              fontSize: 12,
              opacity: 0.6,
              marginBottom: 6,
            }}
          >
            TBC OBJECT
          </div>

          <div
            style={{
              fontSize: 18,
              fontWeight:
                "bold",
            }}
          >
            {
              selectedObject.name
            }
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 13,
              opacity: 0.7,
            }}
          >
            Base ID:
          </div>

          <div
            style={{
              marginTop: 3,
              fontSize: 14,
            }}
          >
            {getBaseTBCName(
              selectedObject.name
            )}
          </div>

          <button
            onClick={() =>
              setSelectedObject(
                null
              )
            }
            style={{
              marginTop: 15,
              padding:
                "8px 14px",
              border: "none",
              borderRadius: 6,
              cursor:
                "pointer",
            }}
          >
            Cerrar
          </button>
        </div>
      )}

      <div
        style={{
          position:
            "absolute",
          bottom: 30,
          left: "50%",
          transform:
            "translateX(-50%)",
          background:
            "rgba(0,0,0,0.75)",
          color: "white",
          padding:
            "12px 20px",
          borderRadius: 8,
          fontFamily:
            "Arial",
          fontSize: 14,
          pointerEvents:
            "none",
          zIndex: 10,
        }}
      >
        Click para entrar · WASD para moverte · Mouse para mirar · ESC para salir
      </div>
    </div>
  );
}

export default App;