import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  floorMat,
  wallMat,
  consoleMat,
  screenMat,
  plantMat,
  soilMat,
  waterMat,
  medMat,
  cargoMat,
  pipeMat,
  cryoMat,
  glowCyanMat,
  glowOrangeMat,
  glowWhiteMat,
  quartersMat,
  shuttleMat,
  glassMat,
  accentMat,
  hullDarkMat,
  schoolMat,
} from './materials';
import { Part } from './Part';
import { anim } from './anim';

const PI = Math.PI;
const DECK_Y = [-3.0, -0.85, 1.3]; // floor heights: lower, mid, upper

function Console({ position, rotation = 0, w = 1.1 }: { position: [number, number, number]; rotation?: number; w?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.4, 0]} material={consoleMat}>
        <boxGeometry args={[0.5, 0.8, w]} />
      </mesh>
      <mesh position={[0.2, 0.95, 0]} rotation={[0, 0, -0.9]} material={screenMat}>
        <boxGeometry args={[0.04, 0.5, w * 0.9]} />
      </mesh>
    </group>
  );
}

function Seat({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.3, 0]} material={quartersMat}>
        <boxGeometry args={[0.5, 0.12, 0.5]} />
      </mesh>
      <mesh position={[-0.22, 0.65, 0]} material={quartersMat}>
        <boxGeometry args={[0.08, 0.7, 0.5]} />
      </mesh>
      <mesh position={[0, 0.12, 0]} material={consoleMat}>
        <cylinderGeometry args={[0.06, 0.12, 0.25, 8]} />
      </mesh>
    </group>
  );
}

function Wall({ x, deck, z0 = -5.1, z1 = 5.1 }: { x: number; deck: number; z0?: number; z1?: number }) {
  return (
    <mesh position={[x, DECK_Y[deck] + 1.0, (z0 + z1) / 2]} material={wallMat}>
      <boxGeometry args={[0.08, 1.95, z1 - z0]} />
    </mesh>
  );
}

// ---------------------------------------------------------------- DECKS
function DeckSlabs() {
  return (
    <group>
      {DECK_Y.map((y, i) => (
        <mesh key={i} position={[17, y, 0]} material={floorMat}>
          <boxGeometry args={[23.4, 0.12, 10.4]} />
        </mesh>
      ))}
      {/* central corridor light strips */}
      {DECK_Y.map((y, i) => (
        <mesh key={i} position={[17, y + 2.02, 0]} material={glowWhiteMat}>
          <boxGeometry args={[22, 0.03, 0.15]} />
        </mesh>
      ))}
      {/* lift shaft */}
      <mesh position={[19.2, 0, -4.6]} material={glassMat}>
        <boxGeometry args={[1.2, 6.2, 1.0]} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------- UPPER DECK
function UpperDeck() {
  const y = DECK_Y[2];
  const holo = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (holo.current) holo.current.rotation.y = anim.time * 0.6;
  });
  return (
    <group>
      <Wall x={20} deck={2} />
      <Wall x={14} deck={2} />
      <Wall x={6} deck={2} />
      {/* CIC */}
      <Part id="cic">
        <group position={[24, y, 0]}>
          <mesh position={[0, 0.45, 0]} material={consoleMat}>
            <cylinderGeometry args={[1.1, 1.3, 0.9, 24]} />
          </mesh>
          <mesh ref={holo} position={[0, 1.35, 0]} material={glowCyanMat}>
            <sphereGeometry args={[0.55, 12, 8]} />
          </mesh>
          <mesh position={[0, 0.92, 0]} material={screenMat}>
            <cylinderGeometry args={[1.15, 1.15, 0.03, 24]} />
          </mesh>
          {[-3, 3].map((z) => (
            <group key={z}>
              <Console position={[-2.5, 0, z]} rotation={0} />
              <Console position={[-1.0, 0, z]} rotation={0} />
              <Console position={[1.0, 0, z]} rotation={0} />
              <Console position={[2.5, 0, z]} rotation={0} />
              {[-2.5, -1, 1, 2.5].map((x) => (
                <Seat key={x} position={[x - 0.6, 0, z]} />
              ))}
            </group>
          ))}
          {/* AI core racks */}
          {[-1.4, 0, 1.4].map((x) => (
            <mesh key={x} position={[x, 0.85, -4.6]} material={consoleMat}>
              <boxGeometry args={[1.0, 1.7, 0.6]} />
            </mesh>
          ))}
          {[-1.4, 0, 1.4].map((x) => (
            <mesh key={x} position={[x, 0.85, -4.28]} material={glowCyanMat}>
              <boxGeometry args={[0.8, 1.4, 0.03]} />
            </mesh>
          ))}
        </group>
      </Part>
      {/* Medbay */}
      <Part id="medbay">
        <group position={[17, y, 0]}>
          {[-3.6, -1.8, 1.8, 3.6].map((z) => (
            <group key={z}>
              <mesh position={[-1.2, 0.45, z]} material={medMat}>
                <boxGeometry args={[1.8, 0.35, 0.8]} />
              </mesh>
              <mesh position={[-1.2, 0.2, z]} material={consoleMat}>
                <boxGeometry args={[1.0, 0.4, 0.5]} />
              </mesh>
              <mesh position={[-0.1, 0.9, z]} material={screenMat}>
                <boxGeometry args={[0.05, 0.4, 0.5]} />
              </mesh>
            </group>
          ))}
          {/* surgical bay */}
          <mesh position={[1.6, 0.45, 0]} material={medMat}>
            <boxGeometry args={[2, 0.3, 1.0]} />
          </mesh>
          <mesh position={[1.6, 1.6, 0]} material={pipeMat}>
            <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
          </mesh>
          <mesh position={[1.6, 1.3, 0]} rotation={[0, 0, PI / 2]} material={pipeMat}>
            <cylinderGeometry args={[0.08, 0.08, 1.6, 8]} />
          </mesh>
          <mesh position={[1.6, 1.25, 0]} material={glowWhiteMat}>
            <sphereGeometry args={[0.15, 8, 6]} />
          </mesh>
          {/* gene bank dewars */}
          {[-4.2, -3.2, 3.2, 4.2].map((z) => (
            <mesh key={z} position={[2.4, 0.7, z]} material={cryoMat}>
              <cylinderGeometry args={[0.35, 0.35, 1.4, 14]} />
            </mesh>
          ))}
        </group>
      </Part>
      {/* Labs / seed vault */}
      <group position={[10, y, 0]}>
        {[-3.6, -2.2, 2.2, 3.6].map((z) => (
          <mesh key={z} position={[0, 0.8, z]} material={cryoMat}>
            <boxGeometry args={[6.5, 1.5, 0.7]} />
          </mesh>
        ))}
        {[-3.6, -2.2, 2.2, 3.6].map((z) => (
          <mesh key={z} position={[0, 0.8, z + (z > 0 ? -0.37 : 0.37)]} material={glowCyanMat}>
            <boxGeometry args={[6.2, 0.06, 0.02]} />
          </mesh>
        ))}
        <mesh position={[0, 0.45, 0]} material={consoleMat}>
          <boxGeometry args={[5, 0.9, 1.2]} />
        </mesh>
        <mesh position={[0, 0.92, 0]} material={schoolMat}>
          <boxGeometry args={[4.8, 0.04, 1.1]} />
        </mesh>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------- MID DECK
function Plants() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const trays = [-3.9, -1.3, 1.3, 3.9];
  const per = 36;
  useLayoutEffect(() => {
    if (!ref.current) return;
    const o = new THREE.Object3D();
    let i = 0;
    for (const z of trays) {
      for (let k = 0; k < per; k++) {
        const x = 6.6 + (k / per) * 11;
        const h = 0.25 + ((k * 7919) % 13) / 40;
        o.position.set(x, DECK_Y[1] + 0.3 + h / 2, z + (((k * 31) % 5) - 2) * 0.12);
        o.scale.set(0.35, h, 0.35);
        o.updateMatrix();
        ref.current.setMatrixAt(i++, o.matrix);
      }
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, trays.length * per]} material={plantMat}>
      <sphereGeometry args={[0.5, 6, 5]} />
    </instancedMesh>
  );
}

function MidDeck() {
  const y = DECK_Y[1];
  return (
    <group>
      <Wall x={18} deck={1} />
      <Wall x={24} deck={1} />
      {/* Hydroponics */}
      <Part id="hydroponics">
        <group>
          {[-3.9, -1.3, 1.3, 3.9].map((z) => (
            <group key={z}>
              <mesh position={[12, y + 0.2, z]} material={soilMat}>
                <boxGeometry args={[11.5, 0.3, 1.4]} />
              </mesh>
              <mesh position={[12, y + 1.85, z]} material={glowOrangeMat}>
                <boxGeometry args={[11.5, 0.05, 0.4]} />
              </mesh>
            </group>
          ))}
          <Plants />
          {/* algae bioreactors */}
          {[-4.3, 4.3].map((z) => (
            <mesh key={z} position={[7, y + 0.9, z * 0.95]} material={plantMat}>
              <cylinderGeometry args={[0.4, 0.4, 1.7, 12]} />
            </mesh>
          ))}
        </group>
      </Part>
      {/* Galley / commons */}
      <group position={[21, y, 0]}>
        {[
          [-1.5, -3],
          [1.5, -3],
          [-1.5, 0],
          [1.5, 0],
          [-1.5, 3],
          [1.5, 3],
        ].map(([x, z], i) => (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 0.55, 0]} material={medMat}>
              <cylinderGeometry args={[0.6, 0.6, 0.06, 16]} />
            </mesh>
            <mesh position={[0, 0.27, 0]} material={consoleMat}>
              <cylinderGeometry args={[0.08, 0.2, 0.55, 8]} />
            </mesh>
            <Seat position={[0.9, 0, 0]} rotation={PI} />
            <Seat position={[-0.9, 0, 0]} />
          </group>
        ))}
      </group>
      {/* Council chamber / school */}
      <group position={[26, y, 0]}>
        <mesh position={[0.8, 0.4, 0]} material={consoleMat}>
          <boxGeometry args={[0.6, 0.8, 4.5]} />
        </mesh>
        <mesh position={[0.5, 0.9, 0]} material={screenMat}>
          <boxGeometry args={[0.04, 0.8, 4.0]} />
        </mesh>
        {[-3.5, -2.3, -1.1, 0.1, 1.3, 2.5, 3.7].map((z) => (
          <group key={z}>
            <Seat position={[-0.6, 0, z]} />
            <Seat position={[-1.6, 0, z]} />
          </group>
        ))}
      </group>
    </group>
  );
}

// ---------------------------------------------------------------- LOWER DECK
function Cargo() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const n = 30;
  useLayoutEffect(() => {
    if (!ref.current) return;
    const o = new THREE.Object3D();
    for (let i = 0; i < n; i++) {
      const col = i % 10;
      const row = Math.floor(i / 10);
      o.position.set(15.6 + col * 0.45, DECK_Y[0] + 0.5 + (row === 2 ? 0.9 : 0), row === 2 ? -4.5 : row === 0 ? -4.5 : 4.5);
      o.scale.set(0.42, 0.85, 0.9);
      o.updateMatrix();
      ref.current.setMatrixAt(i, o.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, n]} material={cargoMat}>
      <boxGeometry args={[1, 1, 1]} />
    </instancedMesh>
  );
}

function Shuttle({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, PI / 2]} material={shuttleMat}>
        <capsuleGeometry args={[0.45, 2.0, 6, 14]} />
      </mesh>
      <mesh position={[-0.3, 0, 0]} material={shuttleMat}>
        <boxGeometry args={[1.4, 0.12, 3.0]} />
      </mesh>
      <mesh position={[0.9, 0.25, 0]} scale={[1.4, 0.6, 1]} material={glassMat}>
        <sphereGeometry args={[0.35, 12, 8]} />
      </mesh>
      <mesh position={[-1.5, 0, 0]} rotation={[0, 0, PI / 2]} material={glowCyanMat}>
        <cylinderGeometry args={[0.3, 0.2, 0.3, 12]} />
      </mesh>
      {[-0.8, 0.8].map((z) => (
        <mesh key={z} position={[0, -0.6, z]} material={hullDarkMat}>
          <boxGeometry args={[0.1, 0.5, 0.1]} />
        </mesh>
      ))}
      <mesh position={[-0.3, 0.07, 0]} material={accentMat}>
        <boxGeometry args={[1.0, 0.02, 2.8]} />
      </mesh>
    </group>
  );
}

function LowerDeck() {
  const y = DECK_Y[0];
  const arm = useRef<THREE.Group>(null);
  useFrame(() => {
    if (arm.current) arm.current.rotation.y = Math.sin(anim.time * 0.8) * 0.8;
  });
  return (
    <group>
      <Wall x={9.6} deck={0} />
      <Wall x={15} deck={0} />
      <Wall x={20.5} deck={0} />
      {/* Water reserve */}
      <Part id="water">
        <group>
          {[6.9, 8.6].map((x) => (
            <mesh key={x} position={[x, y + 1.0, 0]} rotation={[PI / 2, 0, 0]} material={waterMat}>
              <cylinderGeometry args={[0.75, 0.75, 9.4, 20]} />
            </mesh>
          ))}
          {/* wrap-around shield tanks along the hull sides */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[17, 0, s * 5.0]} material={waterMat}>
              <boxGeometry args={[22, 6.0, 0.25]} />
            </mesh>
          ))}
        </group>
      </Part>
      {/* Hangar */}
      <Part id="hangar">
        <group>
          <Shuttle position={[12.3, y + 0.85, -2.4]} />
          <Shuttle position={[12.3, y + 0.85, 2.4]} />
          {/* EVA pods */}
          {[-4.4, 4.4].map((z) => (
            <mesh key={z} position={[10.4, y + 0.6, z]} material={shuttleMat}>
              <sphereGeometry args={[0.45, 12, 10]} />
            </mesh>
          ))}
          <mesh position={[12.3, y + 2.0, 0]} material={glowOrangeMat}>
            <boxGeometry args={[4.8, 0.05, 0.2]} />
          </mesh>
        </group>
      </Part>
      {/* Manufacturing */}
      <group position={[17.7, y, 0]}>
        {[-1, 1].map((sx) =>
          [-1, 1].map((sz) => (
            <mesh key={`${sx}${sz}`} position={[sx * 1.2, 0.9, sz * 1.2]} material={pipeMat}>
              <boxGeometry args={[0.12, 1.8, 0.12]} />
            </mesh>
          )),
        )}
        <mesh position={[0, 1.8, 0]} material={pipeMat}>
          <boxGeometry args={[2.6, 0.12, 2.6]} />
        </mesh>
        <mesh position={[0, 0.4, 0]} material={glowOrangeMat}>
          <boxGeometry args={[1.2, 0.6, 1.2]} />
        </mesh>
        <group ref={arm} position={[0, 0, -3.2]}>
          <mesh position={[0, 0.5, 0]} material={consoleMat}>
            <cylinderGeometry args={[0.25, 0.35, 1.0, 10]} />
          </mesh>
          <mesh position={[0.6, 1.2, 0]} rotation={[0, 0, -0.9]} material={pipeMat}>
            <boxGeometry args={[1.6, 0.16, 0.16]} />
          </mesh>
        </group>
        <Cargo />
      </group>
      {/* ECLSS */}
      <Part id="eclss">
        <group position={[24.3, y, 0]}>
          {[-3.6, -2.4, -1.2].map((z) => (
            <mesh key={z} position={[-2, 0.95, z]} material={medMat}>
              <cylinderGeometry args={[0.42, 0.42, 1.8, 14]} />
            </mesh>
          ))}
          {[1.2, 2.4, 3.6].map((z) => (
            <mesh key={z} position={[-2, 0.95, z]} material={cryoMat}>
              <cylinderGeometry args={[0.42, 0.42, 1.8, 14]} />
            </mesh>
          ))}
          {/* Sabatier reactor */}
          <mesh position={[0.5, 0.7, -2.8]} rotation={[0, 0, PI / 2]} material={glowOrangeMat}>
            <cylinderGeometry args={[0.45, 0.45, 2.4, 14]} />
          </mesh>
          {/* CO2 amine beds */}
          {[0, 1.2, 2.4].map((z) => (
            <mesh key={z} position={[0.5, 0.6, z]} material={consoleMat}>
              <boxGeometry args={[1.2, 1.2, 0.9]} />
            </mesh>
          ))}
          {/* electrolysis stack */}
          <mesh position={[2.6, 0.75, 0]} material={schoolMat}>
            <boxGeometry args={[1.0, 1.5, 3.0]} />
          </mesh>
          {/* overhead pipes */}
          {[-1, 0, 1].map((k) => (
            <mesh key={k} position={[0, 1.95, k * 0.5]} rotation={[0, 0, PI / 2]} material={pipeMat}>
              <cylinderGeometry args={[0.07, 0.07, 7, 8]} />
            </mesh>
          ))}
        </group>
      </Part>
    </group>
  );
}

// ---------------------------------------------------------------- BRIDGE
function Bridge() {
  const holo = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (holo.current) {
      holo.current.rotation.y = anim.time * 0.5;
      holo.current.rotation.x = Math.sin(anim.time * 0.3) * 0.2;
    }
  });
  const holoMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#4ff4ff', wireframe: true, transparent: true, opacity: 0.6 }),
    [],
  );
  return (
    <Part id="bridge">
      <group position={[0, -0.65, 0]}>
        <mesh position={[33, 0, 0]} material={floorMat}>
          <boxGeometry args={[7.5, 0.1, 5.2]} />
        </mesh>
        {/* pilot / copilot */}
        <Console position={[36.6, 0, -0.9]} w={1.4} />
        <Console position={[36.6, 0, 0.9]} w={1.4} />
        <Seat position={[35.6, 0, -0.9]} />
        <Seat position={[35.6, 0, 0.9]} />
        {/* side stations */}
        <Console position={[33.5, 0, -2.2]} rotation={PI / 2} w={2} />
        <Console position={[33.5, 0, 2.2]} rotation={-PI / 2} w={2} />
        <Seat position={[33.5, 0, -1.4]} rotation={PI / 2} />
        <Seat position={[33.5, 0, 1.4]} rotation={-PI / 2} />
        {/* captain */}
        <group position={[30.8, 0, 0]}>
          <Seat position={[0, 0.15, 0]} />
          <mesh position={[0, 0.1, 0]} material={consoleMat}>
            <cylinderGeometry args={[0.7, 0.8, 0.2, 16]} />
          </mesh>
        </group>
        {/* astrogation holo table */}
        <group position={[33.2, 0, 0]}>
          <mesh position={[0, 0.4, 0]} material={consoleMat}>
            <cylinderGeometry args={[0.7, 0.85, 0.8, 20]} />
          </mesh>
          <mesh position={[0, 0.82, 0]} material={screenMat}>
            <cylinderGeometry args={[0.72, 0.72, 0.03, 20]} />
          </mesh>
          <mesh ref={holo} position={[0, 1.4, 0]} material={holoMat}>
            <icosahedronGeometry args={[0.5, 1]} />
          </mesh>
        </group>
        {/* forward viewport frame glow */}
        <mesh position={[37.6, 1.2, 0]} material={glowCyanMat}>
          <boxGeometry args={[0.05, 0.05, 3.2]} />
        </mesh>
      </group>
    </Part>
  );
}

export function Interior() {
  return (
    <group>
      <DeckSlabs />
      <UpperDeck />
      <MidDeck />
      <LowerDeck />
      <Bridge />
    </group>
  );
}
