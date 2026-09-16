function Vitrine({ position = [0, 0, 0], onClick }) {
  return (
    <group position={position} onClick={onClick}>
      <mesh position={[0, -1.5, 0]}>
        <boxGeometry args={[2.5, 0.3, 1.5]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.5, 2.7, 1.5]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.25}
        />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
    </group>
  );
}

export default Vitrine;