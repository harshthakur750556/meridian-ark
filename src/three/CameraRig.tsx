import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useStore } from '../store';
import { anim } from './anim';

export function CameraRig() {
  const controls = useRef<OrbitControlsImpl>(null);
  const camera = useThree((s) => s.camera);
  const focus = useStore((s) => s.focus);
  const focusVersion = useStore((s) => s.focusVersion);
  const goalPos = useRef(new THREE.Vector3(...focus.position));
  const goalTarget = useRef(new THREE.Vector3(...focus.target));
  const flying = useRef(0);

  useEffect(() => {
    goalPos.current.set(...focus.position);
    goalTarget.current.set(...focus.target);
    flying.current = 1;
  }, [focusVersion, focus]);

  useFrame((state, dt) => {
    const c = controls.current;
    if (!c) return;
    if (flying.current > 0) {
      const k = 1 - Math.exp(-Math.min(dt, 0.1) * 3);
      camera.position.lerp(goalPos.current, k);
      c.target.lerp(goalTarget.current, k);
      if (camera.position.distanceTo(goalPos.current) < 0.05 && c.target.distanceTo(goalTarget.current) < 0.05) {
        flying.current = 0;
      }
    }
    // warp shake
    if (anim.warp > 0.05) {
      const s = anim.warp * 0.045;
      const t = state.clock.elapsedTime * 22;
      camera.position.x += Math.sin(t * 1.7) * s * dt;
      camera.position.y += Math.sin(t * 2.3 + 1.5) * s * dt;
      camera.position.z += Math.cos(t * 1.9 + 0.7) * s * dt;
    }
    c.update();
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={4}
      maxDistance={260}
      onStart={() => {
        flying.current = 0;
      }}
    />
  );
}
