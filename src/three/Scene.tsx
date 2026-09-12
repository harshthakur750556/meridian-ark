import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Hull } from './Hull';
import { HabitatRings } from './HabitatRings';
import { Engineering } from './Engineering';
import { Interior } from './Interior';
import { Space, Ticker, WarpBubble } from './Effects';
import { CameraRig } from './CameraRig';
import { Labels } from './Labels';
import { useStore } from '../store';
import { anim } from './anim';

function Ship() {
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!g.current) return;
    // gentle station-keeping drift
    g.current.position.y = Math.sin(anim.time * 0.35) * 0.25;
    g.current.rotation.z = Math.sin(anim.time * 0.22) * 0.006;
    g.current.rotation.x = Math.sin(anim.time * 0.17) * 0.005;
  });
  return (
    <group ref={g}>
      <Hull />
      <HabitatRings />
      <Engineering />
      <Interior />
      <Labels />
      <WarpBubble />
    </group>
  );
}

function Lights() {
  const key = useRef<THREE.DirectionalLight>(null);
  useFrame(() => {
    if (key.current) key.current.intensity = 2.4 - anim.warp * 1.2;
  });
  return (
    <>
      <ambientLight intensity={0.25} color="#8fb3ff" />
      <hemisphereLight args={['#6d8bff', '#2a1a10', 0.5]} />
      <directionalLight ref={key} position={[80, 60, 40]} intensity={2.4} color="#fff2df" />
      <directionalLight position={[-60, -30, -50]} intensity={0.5} color="#4c6fff" />
      <pointLight position={[0, 0, 0]} intensity={1.2} distance={40} color="#ffd9a8" />
    </>
  );
}

export function Scene() {
  const select = useStore((s) => s.select);
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      camera={{ position: [60, 26, 62], fov: 45, near: 0.1, far: 2500 }}
      onPointerMissed={() => select(null)}
    >
      <color attach="background" args={['#02030a']} />
      <fog attach="fog" args={['#02030a', 180, 520]} />
      <Suspense fallback={null}>
        <Lights />
        <Space />
        <Ship />
        <Ticker />
        <CameraRig />
        <EffectComposer multisampling={0}>
          <Bloom luminanceThreshold={0.85} luminanceSmoothing={0.2} intensity={1.15} mipmapBlur radius={0.6} />
          <Vignette eskil={false} offset={0.2} darkness={0.75} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
