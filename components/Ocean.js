'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { clone as skClone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { CREATURES } from '../data/creatures';
import { screensAt } from '../data/dive';
import { BASE } from '../data/site';

const DRACO = `${BASE}/draco/`;
const K = 6; // world units per scroll screen
const Y = (d) => -screensAt(d) * K;
const FLOOR_Y = -12 * K; // 1,000 m: the 3D layer hands off to the dark 2D deep below this
const STOPS = [
  [0, '#4fb6dd'], [-8, '#2b8fbf'], [-24, '#1a6f8f'], [-40, '#0e4a72'], [-56, '#0c3d66'], [-68, '#0b2f5c'], [FLOOR_Y - 6, '#0a2a58'],
].map(([y, c]) => [y, new THREE.Color(c)]);
function colorAt(y) {
  for (let i = 0; i < STOPS.length - 1; i++) {
    const [y0, c0] = STOPS[i], [y1, c1] = STOPS[i + 1];
    if (y >= y1) return c0.clone().lerp(c1, (y0 - y) / (y0 - y1));
  }
  return STOPS[STOPS.length - 1][1].clone();
}
const targetY = () => -Math.max(0, (typeof window !== 'undefined' && window.__odS) || 0) * K;

function Rig({ reduced }) {
  const { camera, scene, size } = useThree();
  const amb = useRef(), dir = useRef(), torch = useRef();
  useFrame((s, dt) => {
    const ty = targetY();
    const k = reduced ? 1 : 1 - Math.pow(0.02, dt);
    camera.position.y += (ty - camera.position.y) * k;
    camera.position.z = size.width / size.height < 0.75 ? 13 : 10;
    camera.position.x = reduced ? 0 : Math.sin(s.clock.elapsedTime * 0.15) * 0.5;
    const y = camera.position.y;
    const c = colorAt(y);
    scene.background = c; scene.fog.color.copy(c);
    const d = Math.min(1, -y / -FLOOR_Y);
    scene.fog.near = 3 - d * 1.5; scene.fog.far = 34 - d * 16;
    amb.current.intensity = 0.9 - d * 0.7;
    dir.current.intensity = Math.max(0, 1.6 - d * 2.2);
    torch.current.position.set(camera.position.x, y + 1, 4);
    torch.current.intensity = Math.max(0, d - 0.3) * 60;
  });
  return (<><ambientLight ref={amb} intensity={0.9} /><directionalLight ref={dir} position={[2, 20, 6]} intensity={1.6} /><pointLight ref={torch} color="#bfe6ff" distance={16} decay={1.2} intensity={0} /></>);
}

// mount children only once the camera gets near (lazy-loads the GLBs as you dive)
function Gate({ y, children }) {
  const [on, setOn] = useState(false);
  useFrame(({ camera }) => { if (!on && Math.abs(camera.position.y - y) < 26) setOn(true); });
  return on ? <Suspense fallback={null}>{children}</Suspense> : null;
}

function useModel(file) {
  const g = useGLTF(`${BASE}/models/${file}.glb`, DRACO);
  return g;
}

function Normalized({ obj, size, rot = [0, 0, 0] }) {
  const ref = useRef();
  useLayoutEffect(() => {
    const box = new THREE.Box3().setFromObject(obj);
    const dim = box.getSize(new THREE.Vector3()), ctr = box.getCenter(new THREE.Vector3());
    const s = size / Math.max(dim.x, dim.y, dim.z);
    ref.current.scale.setScalar(s);
    obj.position.sub(ctr);
  }, [obj, size]);
  return <group rotation={rot}><group ref={ref}><primitive object={obj} /></group></group>;
}

function Creature({ c, reduced, onPick, lite, idx = 0, total = 1 }) {
  const { scene } = useModel(c.model);
  const obj = useMemo(() => {
    const o = skClone(scene);
    // render skinned fish as static meshes (bind pose): lighter, and avoids bone-scale issues
    const swaps = [];
    o.traverse((m) => { if (m.isSkinnedMesh) swaps.push(m); });
    swaps.forEach((sm) => {
      const g = sm.geometry.clone(); g.deleteAttribute('skinIndex'); g.deleteAttribute('skinWeight');
      const n = g.attributes.normal; if (n) { for (let i = 0; i < n.array.length; i++) n.array[i] *= -1; }
      const mesh = new THREE.Mesh(g, sm.material);
      sm.updateWorldMatrix(true, false);
      mesh.applyMatrix4(sm.matrixWorld);
      o.add(mesh); sm.parent.remove(sm);
    });
    o.updateMatrixWorld(true);
    o.traverse((m) => {
      if (!m.isMesh) return;
      m.frustumCulled = false;
      m.material.side = THREE.DoubleSide;
      if (!c.glow && !c.jelly && m.material.color) { m.material.emissive = m.material.color.clone().multiplyScalar(c.depth > 700 ? 0.6 : c.depth > 300 ? 0.45 : 0.25); }
      m.material = m.material.clone();
      if (c.glow) { m.material.emissive = new THREE.Color(c.color); m.material.emissiveIntensity = 1.2; }
      if (c.jelly) { m.material.transparent = true; m.material.opacity = 0.75; m.material.emissive = new THREE.Color(c.color); m.material.emissiveIntensity = c.glow ? 0.9 : 0.35; }
    });
    return o;
  }, [scene, c]);
  const ref = useRef();
  const seed = useMemo(() => Math.random() * 100, []);
  const [hover, setHover] = useState(false);
  useEffect(() => { document.body.style.cursor = hover ? 'pointer' : ''; }, [hover]);
  const baseY = Y(c.depth) + (total > 1 ? (idx % 3 - 1) * 0.9 : 0);
  const dirSign = c.x > 0 ? -1 : 1;
  useFrame((s) => {
    const t = s.clock.elapsedTime * (reduced ? 0.25 : 1) + seed;
    const g = ref.current;
    if (c.speed > 0 && !c.jelly) {
      const w = 0.12 * c.speed, ph = idx * 0.7 + (c.x > 0 ? 0 : Math.PI);
      const A = 4.2;
      g.position.x = A * Math.sin(t * w + ph) + (total > 1 ? (idx % 2) * 0.8 : 0);
      g.position.y = baseY + Math.sin(t * 0.8) * 0.3;
      const vx = Math.cos(t * w + ph);
      const target = (vx >= 0 ? Math.PI / 2 : -Math.PI / 2) + (c.yaw || 0);
      g.rotation.y += (target - g.rotation.y) * 0.04;
    } else {
      g.position.x = c.x + (c.jelly ? Math.sin(t * 0.3) * 0.8 : 0);
      g.position.y = baseY + (c.jelly ? Math.sin(t * 0.6) * 0.6 : 0);
      if (c.jelly) g.scale.setScalar(1 + Math.sin(t * 2) * 0.06);
    }
  });
  const pick = (e) => { e.stopPropagation(); onPick(c.id); };
  return (
    <group ref={ref} position={[c.x, baseY, c.id === 'kelp' ? -2 : 0]} onClick={pick}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); }} onPointerOut={() => setHover(false)}>
      <Normalized obj={obj} size={c.size * (hover ? 1.08 : 1)} />
      {c.lure && (<mesh position={[0, c.size * 0.45, c.size * 0.55]}><sphereGeometry args={[0.12, 12, 8]} /><meshBasicMaterial color="#fff6a8" />{!lite && <pointLight color="#ffe680" intensity={6} distance={6} />}</mesh>)}
      {/* generous invisible hit area for fingers */}
      <mesh visible={false}><sphereGeometry args={[c.size * 0.6, 8, 6]} /></mesh>
    </group>
  );
}

function KelpForest({ lite }) {
  const { scene } = useModel('kelp');
  const items = useMemo(() => Array.from({ length: lite ? 6 : 12 }, (_, i) => ({ x: (i % 2 ? 1 : -1) * (2.5 + Math.random() * 5), z: -3 - Math.random() * 6, h: 6 + Math.random() * 6, r: Math.random() * 6 })), [lite]);
  const objs = useMemo(() => items.map(() => scene.clone()), [scene, items]);
  const ref = useRef();
  useFrame((s) => ref.current.children.forEach((m, i) => (m.rotation.z = Math.sin(s.clock.elapsedTime * 0.6 + items[i].r) * 0.06)));
  return (
    <group ref={ref}>
      {items.map((it, i) => (<group key={i} position={[it.x, Y(25) - 5, it.z]}><Normalized obj={objs[i]} size={it.h} /></group>))}
    </group>
  );
}

const rayMat = () => new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  uniforms: { t: { value: 0 }, o: { value: 0.18 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
  fragmentShader: 'varying vec2 vUv; uniform float t; uniform float o; void main(){ float a = smoothstep(0.0,0.5,vUv.x)*smoothstep(1.0,0.5,vUv.x); a *= pow(vUv.y,1.6); a *= 0.75+0.25*sin(t*0.7+vUv.x*6.0); gl_FragColor=vec4(0.85,0.95,1.0,a*o);}',
});
function GodRays({ reduced }) {
  const rays = useMemo(() => Array.from({ length: 7 }, (_, i) => ({ x: -9 + i * 3 + Math.random() * 1.5, rz: -0.25 + Math.random() * 0.15, w: 1.2 + Math.random() * 2.2, m: rayMat(), ph: Math.random() * 6 })), []);
  useFrame((s, dt) => rays.forEach((r) => (r.m.uniforms.t.value += (reduced ? 0.2 : 1) * dt + 0 * r.ph)));
  return (
    <group position={[0, -10, -4]}>
      {rays.map((r, i) => (<mesh key={i} position={[r.x, 0, -i * 0.3]} rotation={[0, 0, r.rz]} material={r.m}><planeGeometry args={[r.w, 34]} /></mesh>))}
    </group>
  );
}

function Particles({ count, reduced }) {
  const ref = useRef();
  const geo = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { a[i * 3] = (Math.random() - 0.5) * 26; a[i * 3 + 1] = -Math.random() * (-FLOOR_Y + 8); a[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(a, 3)); return g;
  }, [count]);
  useFrame((_, dt) => { if (!reduced) { ref.current.position.y -= dt * 0.25; if (ref.current.position.y < -8) ref.current.position.y = 0; } });
  return <points ref={ref} geometry={geo}><pointsMaterial size={0.07} color="#d8ecff" transparent opacity={0.55} depthWrite={false} /></points>;
}

function Biolum({ count, reduced }) {
  const ref = useRef();
  const geo = useMemo(() => {
    const a = new Float32Array(count * 3), c = new Float32Array(count * 3);
    const pal = ['#2bf5c6', '#4ea8ff', '#b47cff'].map((x) => new THREE.Color(x));
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 22; a[i * 3 + 1] = -34 - Math.random() * 46; a[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
      const p = pal[i % 3]; c[i * 3] = p.r; c[i * 3 + 1] = p.g; c[i * 3 + 2] = p.b;
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(a, 3)); g.setAttribute('color', new THREE.BufferAttribute(c, 3)); return g;
  }, [count]);
  useFrame((s) => { ref.current.material.opacity = 0.55 + Math.sin(s.clock.elapsedTime * (reduced ? 0.3 : 1.4)) * 0.35; });
  return <points ref={ref} geometry={geo}><pointsMaterial size={0.16} vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} fog={false} /></points>;
}

function Surface() {
  return <mesh position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[80, 60]} /><meshBasicMaterial color="#d6f3ff" transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} /></mesh>;
}

// tell the page once real frames are on screen, so the poster can fade out
function Ready({ onReady }) {
  const n = useRef(0);
  useFrame(() => { if (++n.current === 3 && onReady) onReady(); });
  return null;
}

export default function Ocean({ lite, reduced, onPick, onReady }) {
  const cs = CREATURES.filter((c) => c.model);
  return (
    <Canvas dpr={lite ? 1 : [1, 1.5]} camera={{ position: [0, 0, 10], fov: 60, near: 0.1, far: 80 }}
      gl={{ antialias: !lite, powerPreference: lite ? 'low-power' : 'high-performance' }} frameloop="always">
      <fog attach="fog" args={['#4fb6dd', 3, 34]} />
      <Rig reduced={reduced} />
      <Ready onReady={onReady} />
      <Surface />
      {!lite && <GodRays reduced={reduced} />}
      <Particles count={lite ? 300 : 1000} reduced={reduced} />
      <Biolum count={lite ? 120 : 360} reduced={reduced} />
      <Gate y={Y(25)}><KelpForest lite={lite} /></Gate>
      {cs.map((c) => (
        <Gate key={c.id} y={Y(c.depth)}>
          {c.school
            ? Array.from({ length: lite ? Math.ceil(c.school / 2) : c.school }, (_, i) => <Creature key={c.id + i} c={c} idx={i} total={lite ? Math.ceil(c.school / 2) : c.school} reduced={reduced} lite={lite} onPick={onPick} />)
            : <Creature c={c} reduced={reduced} lite={lite} onPick={onPick} />}
        </Gate>
      ))}
    </Canvas>
  );
}
