import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import {
  hullMat,
  hullDarkMat,
  hullMidMat,
  accentMat,
  radiatorMat,
  glowBlueMat,
  glowCyanMat,
  glowOrangeMat,
  plasmaMat,
  coilMat,
  cryoMat,
  pipeMat,
  glassMat,
  consoleMat,
  screenMat,
  glowWhiteMat,
} from './materials';
import { Part } from './Part';
import { anim } from './anim';

const PI = Math.PI;

const nozzleMat = new THREE.MeshStandardMaterial({ color: '#2a2f3a', metalness: 0.9, roughness: 0.35, side: THREE.DoubleSide });
const plumeMat = new THREE.MeshBasicMaterial({ color: '#8f5cff', transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false });
const plumeCoreMat = new THREE.MeshBasicMaterial({ color: '#d9c8ff', transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false });

// ---------------------------------------------------------------- FUSION REACTOR (interior)
function Reactor() {
  const plasma = useRef<THREE.Mesh>(null);
  const mat = useMemo(() => plasmaMat.clone(), []);
  useFrame(() => {
    mat.emissiveIntensity = 2.6 + Math.sin(anim.time * 9) * 0.5 + Math.sin(anim.time * 23) * 0.25;
    if (plasma.current) plasma.current.rotation.x = anim.time * 2;
  });
  const coils = useMemo(() => Array.from({ length: 12 }).map((_, i) => (i / 12) * PI * 2), []);
  return (
    <Part id="reactor">
      <group position={[-22.5, 0, 0]}>
        {/* vacuum vessel */}
        <mesh rotation={[0, PI / 2, 0]} material={hullMidMat}>
          <torusGeometry args={[2.3, 0.95, 16, 48]} />
        </mesh>
        {/* plasma */}
        <mesh ref={plasma} rotation={[0, PI / 2, 0]} material={mat}>
          <torusGeometry args={[2.3, 0.55, 12, 64]} />
        </mesh>
        {/* HTS confinement coils */}
        {coils.map((a, i) => (
          <group key={i} rotation={[a, 0, 0]}>
            <mesh position={[0, 2.3, 0]} material={coilMat}>
              <torusGeometry args={[1.35, 0.17, 8, 24]} />
            </mesh>
          </group>
        ))}
        {/* central solenoid */}
        <mesh rotation={[0, 0, PI / 2]} material={coilMat}>
          <cylinderGeometry args={[0.7, 0.7, 2.6, 20]} />
        </mesh>
        {/* direct-energy-conversion grids */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 1.6, 0, 0]} rotation={[0, PI / 2, 0]} material={pipeMat}>
            <torusGeometry args={[3.7, 0.12, 6, 48]} />
          </mesh>
        ))}
        {/* support cradle */}
        <mesh position={[0, -4.2, 0]} material={consoleMat}>
          <boxGeometry args={[4, 0.6, 7]} />
        </mesh>
        {/* engineering consoles */}
        {[-3, 3].map((z) => (
          <group key={z} position={[0, -3.5, z]}>
            <mesh material={consoleMat}>
              <boxGeometry args={[2.4, 0.8, 0.8]} />
            </mesh>
            <mesh position={[0, 0.55, 0]} rotation={[z > 0 ? -0.5 : 0.5, 0, 0]} material={screenMat}>
              <boxGeometry args={[2.2, 0.5, 0.05]} />
            </mesh>
          </group>
        ))}
      </group>
    </Part>
  );
}

// ---------------------------------------------------------------- EXOTIC ENERGY CORE (interior)
function WarpCore() {
  const mat = useMemo(() => glowCyanMat.clone(), []);
  const rings = useRef<THREE.Group>(null);
  useFrame(() => {
    mat.emissiveIntensity = 1.5 + Math.sin(anim.time * 4) * 0.4 + anim.warp * 4;
    if (rings.current) {
      rings.current.children.forEach((c, i) => {
        c.position.y = ((anim.time * (1 + anim.warp * 3) * 1.5 + i * 1.1) % 5.5) - 2.75;
      });
    }
  });
  return (
    <Part id="warpcore">
      <group position={[-17.6, 0, 0]}>
        <mesh material={glassMat}>
          <capsuleGeometry args={[0.8, 5.5, 8, 24]} />
        </mesh>
        <mesh material={mat}>
          <cylinderGeometry args={[0.42, 0.42, 6.2, 16]} />
        </mesh>
        <group ref={rings}>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh key={i} rotation={[PI / 2, 0, 0]} material={coilMat}>
              <torusGeometry args={[0.95, 0.1, 8, 24]} />
            </mesh>
          ))}
        </group>
        {/* end caps */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[0, s * 3.9, 0]} material={hullDarkMat}>
            <cylinderGeometry args={[1.2, 1.2, 0.9, 20]} />
          </mesh>
        ))}
      </group>
    </Part>
  );
}

// ---------------------------------------------------------------- TANKS + POWER STORAGE
function TanksAndStorage() {
  const flywheels = useRef<THREE.Group>(null);
  useFrame(() => {
    if (flywheels.current) flywheels.current.rotation.x = anim.time * 6;
  });
  return (
    <group>
      <Part id="tanks">
        {[
          [2.4, 2.6],
          [2.4, -2.6],
          [-2.4, 2.6],
          [-2.4, -2.6],
        ].map(([y, z], i) => (
          <group key={i} position={[-27.6, y, z]}>
            <mesh material={cryoMat}>
              <sphereGeometry args={[1.55, 24, 16]} />
            </mesh>
            <mesh rotation={[0, 0, PI / 2]} material={pipeMat}>
              <torusGeometry args={[1.56, 0.06, 6, 32]} />
            </mesh>
            <mesh position={[1.7, 0, 0]} rotation={[0, 0, PI / 2]} material={pipeMat}>
              <cylinderGeometry args={[0.12, 0.12, 3.2, 8]} />
            </mesh>
          </group>
        ))}
      </Part>
      <Part id="powerbus">
        <group ref={flywheels} position={[-19.5, -3.2, 0]}>
          {[-3, -1.5, 0, 1.5, 3].map((z) => (
            <mesh key={z} position={[0, 0, z]} rotation={[0, 0, PI / 2]} material={pipeMat}>
              <cylinderGeometry args={[0.55, 0.55, 1.1, 20]} />
            </mesh>
          ))}
        </group>
        {/* battery racks */}
        <mesh position={[-19.5, 3.2, 0]} material={consoleMat}>
          <boxGeometry args={[2.2, 1.6, 7.5]} />
        </mesh>
        {[-3, -1.5, 0, 1.5, 3].map((z) => (
          <mesh key={z} position={[-18.35, 3.2, z]} material={glowWhiteMat}>
            <boxGeometry args={[0.05, 1.2, 0.3]} />
          </mesh>
        ))}
      </Part>
    </group>
  );
}

// ---------------------------------------------------------------- RADIATORS
function Radiators() {
  return (
    <Part id="radiators">
      {[PI / 4, (3 * PI) / 4, (5 * PI) / 4, (7 * PI) / 4].map((a, i) => (
        <group key={i} rotation={[a, 0, 0]}>
          <mesh position={[-24.5, 9.6, 0]} material={radiatorMat}>
            <boxGeometry args={[10.5, 9.4, 0.12]} />
          </mesh>
          {/* manifold */}
          <mesh position={[-24.5, 5.0, 0]} rotation={[0, 0, PI / 2]} material={pipeMat}>
            <cylinderGeometry args={[0.32, 0.32, 10.8, 12]} />
          </mesh>
          <mesh position={[-24.5, 14.3, 0]} rotation={[0, 0, PI / 2]} material={hullDarkMat}>
            <cylinderGeometry args={[0.2, 0.2, 10.8, 10]} />
          </mesh>
          {/* ribs */}
          {[-4, -2, 0, 2, 4].map((ox) => (
            <mesh key={ox} position={[-24.5 + ox, 9.6, 0]} material={hullDarkMat}>
              <boxGeometry args={[0.18, 9.4, 0.3]} />
            </mesh>
          ))}
        </group>
      ))}
    </Part>
  );
}

// ---------------------------------------------------------------- WARP RING
function WarpRing() {
  const inner = useMemo(() => glowCyanMat.clone(), []);
  const outer = useMemo(() => glowBlueMat.clone(), []);
  const emit = useMemo(() => glowCyanMat.clone(), []);
  const light = useRef<THREE.PointLight>(null);
  useFrame(() => {
    const w = anim.warp;
    inner.emissiveIntensity = 1.2 + Math.sin(anim.time * 3) * 0.3 + w * 5;
    outer.emissiveIntensity = 1.0 + w * 3;
    emit.emissiveIntensity = 1.5 + Math.sin(anim.time * 12) * 0.5 * w + w * 4;
    if (light.current) light.current.intensity = 2 + w * 40;
  });
  const nodes = useMemo(() => Array.from({ length: 16 }).map((_, i) => (i / 16) * PI * 2), []);
  return (
    <Part id="warpring">
      <group position={[-18, 0, 0]}>
        <mesh rotation={[0, PI / 2, 0]} material={hullMidMat}>
          <torusGeometry args={[19, 1.1, 16, 128]} />
        </mesh>
        <mesh rotation={[0, PI / 2, 0]} material={inner}>
          <torusGeometry args={[19, 0.5, 10, 128]} />
        </mesh>
        <mesh rotation={[0, PI / 2, 0]} material={outer}>
          <torusGeometry args={[20.25, 0.12, 6, 128]} />
        </mesh>
        <mesh rotation={[0, PI / 2, 0]} material={accentMat}>
          <torusGeometry args={[17.75, 0.12, 6, 128]} />
        </mesh>
        {/* Casimir emitter pods */}
        {nodes.map((a, i) => (
          <group key={i} rotation={[a, 0, 0]}>
            <mesh position={[0, 19, 0]} material={i % 4 === 0 ? accentMat : hullDarkMat}>
              <boxGeometry args={[2.6, 2.2, 1.8]} />
            </mesh>
            <mesh position={[0, 17.6, 0]} material={emit}>
              <coneGeometry args={[0.5, 1.0, 10]} />
            </mesh>
          </group>
        ))}
        {/* struts + waveguides */}
        {[0, PI / 2, PI, (3 * PI) / 2].map((a, i) => (
          <group key={i} rotation={[a, 0, 0]}>
            <mesh position={[0, 11.9, 0]} material={hullMidMat}>
              <boxGeometry args={[1.4, 14.2, 0.7]} />
            </mesh>
            <mesh position={[0, 11.9, 0.4]} material={emit}>
              <boxGeometry args={[0.2, 14.2, 0.06]} />
            </mesh>
          </group>
        ))}
        <pointLight ref={light} color="#4ff4ff" intensity={2} distance={70} decay={2} />
      </group>
    </Part>
  );
}

// ---------------------------------------------------------------- FUSION TORCH
function Torch() {
  const plumes = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  useFrame(() => {
    const flick = 1 + Math.sin(anim.time * 30) * 0.05 + Math.sin(anim.time * 7.3) * 0.08;
    const s = flick * (1 + anim.warp * 0.8);
    if (plumes.current) plumes.current.scale.set(s, 1, 1);
    if (light.current) light.current.intensity = 6 * flick + anim.warp * 10;
  });
  const nozzle = (r1: number, r2: number, len: number, x: number, z: number) => (
    <group position={[x, 0, z]}>
      <mesh rotation={[0, 0, PI / 2]} material={nozzleMat}>
        <cylinderGeometry args={[r1, r2, len, 32, 1, true]} />
      </mesh>
      <mesh position={[len / 2 - 0.1, 0, 0]} rotation={[0, 0, PI / 2]} material={plasmaMat}>
        <cylinderGeometry args={[r2 * 0.92, r2 * 0.92, 0.1, 32]} />
      </mesh>
      {/* magnetic nozzle coils */}
      {[0.2, 0.5, 0.8].map((f) => (
        <mesh key={f} position={[len / 2 - len * f, 0, 0]} rotation={[0, PI / 2, 0]} material={coilMat}>
          <torusGeometry args={[r2 + (r1 - r2) * f + 0.15, 0.14, 8, 40]} />
        </mesh>
      ))}
    </group>
  );
  return (
    <Part id="torch">
      {nozzle(3.7, 2.4, 5.5, -32.6, 0)}
      {nozzle(1.6, 1.05, 3.6, -31.6, 3.7)}
      {nozzle(1.6, 1.05, 3.6, -31.6, -3.7)}
      {/* plumes */}
      <group ref={plumes} position={[-35.3, 0, 0]}>
        <mesh position={[-9, 0, 0]} rotation={[0, 0, PI / 2]} material={plumeMat}>
          <cylinderGeometry args={[0.3, 3.2, 18, 24, 1, true]} />
        </mesh>
        <mesh position={[-5.5, 0, 0]} rotation={[0, 0, PI / 2]} material={plumeCoreMat}>
          <cylinderGeometry args={[0.2, 2.0, 11, 24, 1, true]} />
        </mesh>
        {[3.7, -3.7].map((z) => (
          <mesh key={z} position={[-3.5, 0, z]} rotation={[0, 0, PI / 2]} material={plumeMat}>
            <cylinderGeometry args={[0.15, 1.3, 8, 16, 1, true]} />
          </mesh>
        ))}
      </group>
      <pointLight ref={light} position={[-38, 0, 0]} color="#a67bff" intensity={6} distance={60} decay={2} />
    </Part>
  );
}

// ---------------------------------------------------------------- COMMS
function Comms() {
  const dish = useRef<THREE.Group>(null);
  useFrame(() => {
    if (dish.current) dish.current.rotation.y = Math.sin(anim.time * 0.3) * 0.6;
  });
  return (
    <Part id="comms">
      <group position={[-20, 4.75, 0]}>
        <mesh position={[0, 0.9, 0]} material={pipeMat}>
          <cylinderGeometry args={[0.15, 0.25, 1.8, 8]} />
        </mesh>
        <group ref={dish} position={[0, 1.9, 0]}>
          <mesh rotation={[-0.7, 0, 0]} material={hullMat}>
            <cylinderGeometry args={[1.9, 1.2, 0.35, 32]} />
          </mesh>
          <mesh position={[0, 0.4, 0.9]} rotation={[-0.7, 0, 0]} material={glowOrangeMat}>
            <cylinderGeometry args={[0.08, 0.08, 1.6, 6]} />
          </mesh>
        </group>
        {/* laser comm phased array */}
        <mesh position={[3.5, 0.25, 2.5]} material={consoleMat}>
          <boxGeometry args={[2, 0.5, 2]} />
        </mesh>
        <mesh position={[3.5, 0.52, 2.5]} material={glowOrangeMat}>
          <boxGeometry args={[1.6, 0.05, 1.6]} />
        </mesh>
      </group>
    </Part>
  );
}

export function Engineering() {
  return (
    <group>
      {/* engineering block hull */}
      <RoundedBox args={[14, 9.5, 10]} radius={1} smoothness={4} position={[-23, 0, 0]} material={hullMat} />
      {/* block armour & accents */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[-23, 3.2, 5.05 * s]} material={accentMat}>
            <boxGeometry args={[9, 0.6, 0.1]} />
          </mesh>
          <mesh position={[-23, -3.2, 5.05 * s]} material={glowBlueMat}>
            <boxGeometry args={[9, 0.12, 0.1]} />
          </mesh>
          <RoundedBox args={[5, 3, 0.4]} radius={0.15} position={[-25, 0, 5.1 * s]} material={hullMidMat} />
        </group>
      ))}
      {/* forward coupling collar to spine */}
      <mesh position={[-15.8, 0, 0]} rotation={[0, 0, PI / 2]} material={hullDarkMat}>
        <cylinderGeometry args={[3.4, 3.4, 1.2, 32]} />
      </mesh>
      <Reactor />
      <WarpCore />
      <TanksAndStorage />
      <Radiators />
      <WarpRing />
      <Torch />
      <Comms />
    </group>
  );
}
