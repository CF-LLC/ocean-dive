'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const TOTAL = 120; // world depth units
const cols = ['#3fa9d6', '#1f7a8c', '#0f4c75', '#0a2a4a', '#030a18', '#010308'].map((c) => new THREE.Color(c));
function colorAt(t) {
  const f = t * (cols.length - 1), i = Math.min(Math.floor(f), cols.length - 2);
  return cols[i].clone().lerp(cols[i + 1], f - i);
}
function progress() {
  const h = document.documentElement.scrollHeight - innerHeight;
  return h > 0 ? Math.min(Math.max(scrollY / h, 0), 1) : 0;
}

function Rig() {
  const { camera, scene } = useThree();
  useFrame((s) => {
    const p = progress();
    camera.position.y += (-p * TOTAL - camera.position.y) * 0.08;
    camera.position.x = Math.sin(s.clock.elapsedTime * 0.2) * 0.6;
    const c = colorAt(p);
    scene.background = c; scene.fog.color = c;
  });
  return null;
}

function Fish({ y, color, size = 1, speed = 1, count = 1, shape = 'fish', glow = false, spread = 8 }) {
  const ref = useRef();
  const seeds = useMemo(() => Array.from({ length: count }, (_, i) => [Math.random() * 6.28, (Math.random() - .5) * 6, (Math.random() - .5) * 4 - 6, 0.6 + Math.random() * .8]), [count]);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    ref.current.children.forEach((m, i) => {
      const [ph, dy, dz, sp] = seeds[i];
      const x = ((t * speed * sp + ph * 3) % (spread * 2)) - spread;
      m.position.set(x, y + dy + Math.sin(t + ph) * 0.4, dz);
      m.rotation.z = Math.sin(t * 3 + ph) * 0.08;
      if (shape === 'jelly') m.scale.setScalar(size * (1 + Math.sin(t * 2 + ph) * 0.12));
    });
  });
  const mat = glow ? <meshBasicMaterial color={color} /> : <meshStandardMaterial color={color} roughness={0.6} />;
  return (
    <group ref={ref}>
      {seeds.map((_, i) => (
        <group key={i} scale={size}>
          {shape === 'jelly' ? (
            <mesh><sphereGeometry args={[0.6, 16, 8, 0, 6.28, 0, 1.6]} /><meshStandardMaterial color={color} transparent opacity={0.55} emissive={color} emissiveIntensity={0.4} /></mesh>
          ) : shape === 'turtle' ? (
            <>
              <mesh scale={[1.2, 0.35, 1]}><sphereGeometry args={[0.8, 16, 10]} />{mat}</mesh>
              <mesh position={[1, 0, 0]}><sphereGeometry args={[0.28, 10, 8]} />{mat}</mesh>
            </>
          ) : (
            <>
              <mesh rotation={[0, 0, -Math.PI / 2]} scale={[0.45, 1, 0.3]}><coneGeometry args={[0.6, 2.4, 10]} />{mat}</mesh>
              <mesh position={[-1.25, 0, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 0.15]}><coneGeometry args={[0.45, 0.6, 3]} />{mat}</mesh>
              {shape === 'sword' && <mesh position={[1.7, 0, 0]} rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.05, 1.4, 4]} />{mat}</mesh>}
            </>
          )}
        </group>
      ))}
    </group>
  );
}

function Kelp() {
  const ref = useRef();
  const stalks = useMemo(() => Array.from({ length: 14 }, () => [(Math.random() - .5) * 18, -8 - Math.random() * 6, 6 + Math.random() * 8, Math.random() * 6]), []);
  useFrame((s) => ref.current.children.forEach((m, i) => (m.rotation.z = Math.sin(s.clock.elapsedTime * .7 + stalks[i][3]) * .08)));
  return (
    <group ref={ref} position={[0, -30, 0]}>
      {stalks.map(([x, z, h], i) => (
        <mesh key={i} position={[x, -h / 2 + 2, z]}><cylinderGeometry args={[0.08, 0.15, h * 2, 5]} /><meshStandardMaterial color="#5a8a2a" /></mesh>
      ))}
    </group>
  );
}

function Snow() {
  const geo = useMemo(() => {
    const n = 500, a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { a[i * 3] = (Math.random() - .5) * 30; a[i * 3 + 1] = -Math.random() * TOTAL - 10; a[i * 3 + 2] = (Math.random() - .5) * 20 - 5; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(a, 3)); return g;
  }, []);
  const ref = useRef();
  useFrame((_, d) => (ref.current.position.y -= d * 0.3));
  return <points ref={ref} geometry={geo}><pointsMaterial size={0.06} color="#cfe8ff" transparent opacity={0.6} /></points>;
}

export default function Ocean() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 60 }} gl={{ antialias: false, powerPreference: 'low-power' }}>
      <fog attach="fog" args={['#3fa9d6', 6, 26]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 10, 5]} intensity={1.2} />
      <Rig />
      <mesh position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[80, 80]} /><meshBasicMaterial color="#bfe9ff" transparent opacity={0.35} side={THREE.DoubleSide} /></mesh>
      <Fish y={-6} color="#8aa3b5" size={1.1} count={3} speed={2.5} />
      <Kelp />
      <Fish y={-30} color="#5f7f3a" shape="turtle" count={2} speed={0.9} />
      <Fish y={-30} color="#ffb347" size={0.3} count={14} speed={2} />
      <Fish y={-55} color="#3a6fa8" size={1.3} count={2} speed={2} />
      <Fish y={-58} color="#6b6f80" shape="sword" count={1} speed={3} />
      <Fish y={-52} color="#d9c8ff" shape="jelly" count={5} speed={0.4} />
      <Fish y={-82} color="#4ef0ff" shape="jelly" size={0.6} glow count={8} speed={0.5} />
      <Fish y={-108} color="#a3123a" shape="jelly" size={1.2} count={1} speed={0.3} />
      <Fish y={-110} color="#2bf5c6" size={0.15} glow count={20} speed={0.6} />
      <Snow />
    </Canvas>
  );
}
