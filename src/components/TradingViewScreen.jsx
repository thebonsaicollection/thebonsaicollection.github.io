import { useEffect, useState } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import TradingViewWidget from "./TradingViewWidget";

function TradingViewScreen({ screenObject }) {
  const [transform, setTransform] = useState(null);

  useEffect(() => {
    if (!screenObject) return;

    screenObject.updateWorldMatrix(true, false);

    const position = new THREE.Vector3();

    screenObject.getWorldPosition(position);

    const quaternion = new THREE.Quaternion();

    screenObject.getWorldQuaternion(quaternion);

    const normal = new THREE.Vector3(
      -1,
      0,
      0
    );

    normal.applyQuaternion(quaternion);

    position.add(
      normal.multiplyScalar(0.025)
    );

    setTransform({
      position,
    });
  }, [screenObject]);

  if (!transform) return null;

  return (
    <Html
      transform
      position={transform.position}
      rotation={[
        0,
        Math.PI / 3,
        0,
      ]}
      distanceFactor={1}
      occlude={false}
      style={{
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          width: "750px",
          height: "266px",
          overflow: "hidden",
          background: "#0b0e11",
        }}
      >
        <TradingViewWidget />
      </div>
    </Html>
  );
}

export default TradingViewScreen;