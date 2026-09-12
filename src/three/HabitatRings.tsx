import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../store';
import { anim } from './anim';
import {
  hullMat,
  hullDarkMat,
  hullMidMat,
  accentMat,
  glowBlueMat,
  glowCyanMat,
  windowMat,
  floorMat,
  quartersMat,
  parkMat,
  schoolMat,
  workshopMat,
  plantMat,
  medMat,
  glassMat,
} from './materials';
import { Part } from './Part';

const PI = Math.PI;
const R = 14; // ring major radius
const TUBE = 2.4;

type RoomKind = 'quarters' | 'park' | 'school' | 'farm' | 'workshop' | 'med' | 'commons';
const roomMat: Record<RoomKind, THREE.Material> = {
  quarters: quartersMat,
  park: parkMat,
  school: schoolMat,
  farm: plantMat,
  workshop: workshopMat,
  med: medMat,
  commons: glowCyanMat,
};

const PALETTE_A: RoomKind[] = ['quarters', 'quarters', 'quarters', 'school', 'quarters', 'quarters', 'med', 'park', 'quarters', 'quarters', 'commons', 'quarters'];
const PALETTE_B: RoomKind[] = ['farm', 'farm', 'park', 'farm', 'workshop', 'farm', 'farm', 'commons', 'park', 'farm', 'school', 'farm'];

function Rooms({ count, floorR, height, palette, offset }: { count: number; floorR: number; height: number; palette: RoomKind[]; offset: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * PI * 2 + offset;
        const kind = palette[i % palette.length];
        const w = (2 * PI * floorR) / count - 0.7;
        return (
          <group key={i} rotation={[a, 0, 0]}>
            <mesh position={[0, floorR - height / 2, 0]} material={roomMat[kind]}>
              <boxGeometry args={[3.0, height, w]} />
            </mesh>
            {/* interior light strip */}
            <mesh position={[0, floorR - height - 0.05, 0]} material={windowMat}>
              <boxGeometry args={[2.6, 0.04, 0.2]} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

function RingWindows() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const n = 56;
  useLayoutEffect(() => {
    if (!ref.current) return;
    const o = new THREE.Object3D();
    let i = 0;
    for (let k = 0; k < n; k++) {
      const a = (k / n) * PI * 2;
      for (const x of [-0.65, 0.65]) {
        o.position.set(x, Math.cos(a) * 16.22, Math.sin(a) * 16.22);
        o.rotation.set(a, 0, 0);
        o.scale.set(0.7, 0.12, 0.42);
        o.updateMatrix();
        ref.current.setMatrixAt(i++, o.matrix);
      }
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, n * 2]} material={windowMat}>
      <boxGeometry args={[1, 1, 1]} />
    </instancedMesh>
  );
}

function Ring({ x, dir, id, palette }: { x: number; dir: 1 | -1; id: 'ringA' | 'ringB'; palette: RoomKind[] }) {
  const cutaway = useStore((s) => s.cutaway);
  const contents = useRef<THREE.Group>(null);
  const arc = cutaway ? PI * 1.45 : PI * 2;

  useFrame((_, dt) => {
    if (!contents.current) return;
    const step = dir * 0.16 * anim.spin * Math.min(dt, 0.05);
    contents.current.rotation.x += step;
    if (id === 'ringA') anim.ringAngleA += step;
    else anim.ringAngleB += step;
  });

  const spokes = useMemo(() => [0, 1, 2, 3, 4, 5].map((i) => (i / 6) * PI * 2), []);

  return (
    <Part id={id}>
      <group position={[x, 0, 0]}>
        {/* ---- static shell (cut open in cutaway mode) ---- */}
        <mesh rotation={[0, -PI / 2, 0]} material={hullMat}>
          <torusGeometry args={[R, TUBE, 28, 120, arc]} />
        </mesh>
        {/* shell decoration rings */}
        {[-1.8, 1.8].map((ox) => (
          <mesh key={ox} position={[ox, 0, 0]} rotation={[0, PI / 2, 0]} material={accentMat}>
            <torusGeometry args={[15.6, 0.13, 8, 120]} />
          </mesh>
        ))}
        {[-1.25, 1.25].map((ox) => (
          <mesh key={ox} position={[ox, 0, 0]} rotation={[0, PI / 2, 0]} material={glowBlueMat}>
            <torusGeometry args={[16.05, 0.06, 6, 120]} />
          </mesh>
        ))}
        {/* inner hull rail */}
        <mesh rotation={[0, PI / 2, 0]} material={hullDarkMat}>
          <torusGeometry args={[11.7, 0.35, 8, 120]} />
        </mesh>

        {/* ---- rotating contents ---- */}
        <group ref={contents}>
          {/* hub / maglev bearing */}
          <mesh rotation={[0, 0, PI / 2]} material={hullDarkMat}>
            <cylinderGeometry args={[3.2, 3.2, 3.2, 32]} />
          </mesh>
          <mesh rotation={[0, PI / 2, 0]} material={glowCyanMat}>
            <torusGeometry args={[3.25, 0.1, 8, 48]} />
          </mesh>
          {/* spokes */}
          {spokes.map((a, i) => (
            <group key={i} rotation={[a, 0, 0]}>
              <mesh position={[0, 7.3, 0]} material={hullMidMat}>
                <cylinderGeometry args={[0.38, 0.5, 9.2, 12]} />
              </mesh>
              {/* elevator tube */}
              <mesh position={[0.7, 7.3, 0]} material={glassMat}>
                <cylinderGeometry args={[0.22, 0.22, 9.2, 8]} />
              </mesh>
              <mesh position={[0, 11.9, 0]} material={hullDarkMat}>
                <boxGeometry args={[2.2, 1.2, 1.6]} />
              </mesh>
              {/* escape pods (2 per spoke) */}
              <Part id="pods">
                {[-1, 1].map((s) => (
                  <group key={s} rotation={[s * 0.26, 0, 0]}>
                    <mesh position={[0, 16.65, 0]} material={hullMidMat}>
                      <capsuleGeometry args={[0.36, 0.7, 4, 10]} />
                    </mesh>
                    <mesh position={[0, 16.75, 0]} material={accentMat}>
                      <cylinderGeometry args={[0.38, 0.38, 0.12, 10]} />
                    </mesh>
                  </group>
                ))}
              </Part>
            </group>
          ))}
          {/* deck floors */}
          <mesh rotation={[0, 0, PI / 2]} material={floorMat}>
            <cylinderGeometry args={[15.55, 15.55, 3.5, 96, 1, true]} />
          </mesh>
          <mesh rotation={[0, 0, PI / 2]} material={floorMat}>
            <cylinderGeometry args={[13.95, 13.95, 4.6, 96, 1, true]} />
          </mesh>
          {/* rooms on each deck */}
          <Rooms count={30} floorR={15.5} height={1.25} palette={palette} offset={0} />
          <Rooms count={24} floorR={13.9} height={1.15} palette={[...palette].reverse()} offset={0.13} />
          {/* windows */}
          <RingWindows />
        </group>
      </group>
    </Part>
  );
}

export function HabitatRings() {
  return (
    <group>
      <Ring x={-5} dir={1} id="ringA" palette={PALETTE_A} />
      <Ring x={-13} dir={-1} id="ringB" palette={PALETTE_B} />
    </group>
  );
}
