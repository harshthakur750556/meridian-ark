import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import {
  hullMat,
  hullDarkMat,
  hullMidMat,
  accentMat,
  accentDarkMat,
  glassMat,
  glowBlueMat,
  glowCyanMat,
  glowWhiteMat,
  windowMat,
  navRedMat,
  navGreenMat,
  pipeMat,
} from './materials';
import { Part } from './Part';
import { anim } from './anim';

const PI = Math.PI;

/** deterministic pseudo random */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ---------------------------------------------------------------- SPINE / TRUSS
function Spine() {
  return (
    <Part id="spine">
      {/* main keel */}
      <mesh rotation={[0, 0, PI / 2]} position={[-5.5, 0, 0]} material={hullMidMat}>
        <cylinderGeometry args={[2, 2, 21, 24]} />
      </mesh>
      {/* longitudinal rails */}
      {[0, 1, 2, 3].map((k) => {
        const a = PI / 4 + (k * PI) / 2;
        return (
          <mesh
            key={k}
            rotation={[0, 0, PI / 2]}
            position={[-5.5, Math.cos(a) * 2.8, Math.sin(a) * 2.8]}
            material={hullDarkMat}
          >
            <cylinderGeometry args={[0.22, 0.22, 21, 8]} />
          </mesh>
        );
      })}
      {/* cross rings */}
      {[-15.5, -9.5, -1, 4].map((x) => (
        <mesh key={x} rotation={[0, PI / 2, 0]} position={[x, 0, 0]} material={hullDarkMat}>
          <torusGeometry args={[2.8, 0.14, 8, 32]} />
        </mesh>
      ))}
      {/* power bus lines */}
      {[-1, 1].map((s) => (
        <mesh key={s} rotation={[0, 0, PI / 2]} position={[-5.5, 0.6 * s, 2.25]} material={glowWhiteMat}>
          <cylinderGeometry args={[0.08, 0.08, 21, 6]} />
        </mesh>
      ))}
      {/* transit tube */}
      <mesh rotation={[0, 0, PI / 2]} position={[-5.5, -1.2, -2.2]} material={glassMat}>
        <cylinderGeometry args={[0.45, 0.45, 21, 12]} />
      </mesh>
    </Part>
  );
}

// ---------------------------------------------------------------- FORWARD BODY
function ForwardBody() {
  return (
    <group>
      <RoundedBox args={[24, 6.5, 11]} radius={1.2} smoothness={4} position={[17, 0, 0]} material={hullMat} />
      {/* dorsal ridge */}
      <RoundedBox args={[18, 1.6, 4.2]} radius={0.5} smoothness={3} position={[15, 3.5, 0]} material={hullMidMat} />
      {/* armour plates */}
      {[8, 13, 18, 23].map((x) => (
        <group key={x}>
          <RoundedBox args={[4.2, 2.2, 0.35]} radius={0.15} position={[x, -0.5, 5.6]} material={hullMidMat} />
          <RoundedBox args={[4.2, 2.2, 0.35]} radius={0.15} position={[x, -0.5, -5.6]} material={hullMidMat} />
        </group>
      ))}
      {/* orange racing stripes (Milano style) */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[17, 2.2, 5.62 * s]} material={accentMat}>
            <boxGeometry args={[20, 0.55, 0.1]} />
          </mesh>
          <mesh position={[17, 1.45, 5.62 * s]} material={accentDarkMat}>
            <boxGeometry args={[20, 0.18, 0.1]} />
          </mesh>
          <mesh position={[26, -2.4, 5.62 * s]} material={accentMat}>
            <boxGeometry args={[5, 0.9, 0.1]} />
          </mesh>
        </group>
      ))}
      {/* top accent */}
      <mesh position={[15, 4.32, 0]} material={accentMat}>
        <boxGeometry args={[14, 0.08, 1.2]} />
      </mesh>
      {/* blue running strips */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[17, -1.4, 5.62 * s]} material={glowBlueMat}>
          <boxGeometry args={[18, 0.12, 0.08]} />
        </mesh>
      ))}
      {/* ventral hangar door */}
      <Part id="hangar">
        <mesh position={[11, -3.32, 0]} material={hullDarkMat}>
          <boxGeometry args={[7.5, 0.25, 6.5]} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[11, -3.45, 1.7 * s]} material={accentMat}>
            <boxGeometry args={[7.2, 0.05, 0.3]} />
          </mesh>
        ))}
      </Part>
      {/* sensor dome */}
      <Part id="sensors">
        <group position={[22, 3.55, 0]} scale={[1, 0.7, 1]}>
          <mesh material={hullDarkMat}>
            <sphereGeometry args={[1.7, 24, 16]} />
          </mesh>
        </group>
        <mesh position={[22, 3.6, 0]} rotation={[PI / 2, 0, 0]} material={glowCyanMat}>
          <torusGeometry args={[1.75, 0.08, 8, 40]} />
        </mesh>
        {/* telescope */}
        <mesh position={[9, 4.9, 0]} rotation={[0, 0, PI / 2]} material={hullDarkMat}>
          <cylinderGeometry args={[0.6, 0.7, 4, 16]} />
        </mesh>
        <mesh position={[11.05, 4.9, 0]} rotation={[0, 0, PI / 2]} material={glassMat}>
          <cylinderGeometry args={[0.55, 0.55, 0.1, 16]} />
        </mesh>
      </Part>
      {/* CIC access hatch (clickable) */}
      <Part id="cic">
        <mesh position={[24, 3.3, 3.2]} material={hullDarkMat}>
          <boxGeometry args={[2.5, 0.15, 2]} />
        </mesh>
      </Part>
    </group>
  );
}

// ---------------------------------------------------------------- NOSE / BRIDGE / PRONGS
function Nose() {
  return (
    <group>
      {/* tapered nose cone (flattened) */}
      <group position={[35, 0, 0]} scale={[1, 0.62, 1]}>
        <mesh rotation={[0, 0, -PI / 2]} material={hullMat}>
          <cylinderGeometry args={[1.5, 4.7, 12, 32]} />
        </mesh>
      </group>
      {/* transition collar */}
      <mesh position={[29.2, 0, 0]} rotation={[0, 0, PI / 2]} material={hullDarkMat}>
        <cylinderGeometry args={[4.9, 4.9, 0.6, 32, 1]} />
      </mesh>
      {/* nose tip */}
      <mesh position={[41.4, 0, 0]} rotation={[0, 0, -PI / 2]} material={hullDarkMat}>
        <sphereGeometry args={[1.0, 16, 12]} />
      </mesh>
      {/* cockpit canopy */}
      <Part id="bridge">
        <group position={[32, 2.15, 0]} scale={[1.75, 0.55, 1]}>
          <mesh material={glassMat}>
            <sphereGeometry args={[2.5, 32, 20]} />
          </mesh>
        </group>
        {/* canopy frame */}
        <mesh position={[32, 2.25, 0]} rotation={[0, 0, PI / 2]} material={hullDarkMat}>
          <torusGeometry args={[2.3, 0.08, 8, 40, PI]} />
        </mesh>
        <mesh position={[33.6, 2.6, 0]} rotation={[0, PI / 2, 0]} material={hullDarkMat}>
          <torusGeometry args={[1.9, 0.08, 8, 40, PI]} />
        </mesh>
      </Part>
      {/* orange chin stripe */}
      <mesh position={[34, -1.85, 0]} material={accentMat}>
        <boxGeometry args={[8, 0.15, 2.2]} />
      </mesh>

      {/* forward prongs */}
      {[-1, 1].map((s) => (
        <group key={s} position={[0, 0, 5.3 * s]}>
          <Part id={s < 0 ? 'shield' : 'rcs'}>
            <RoundedBox args={[16, 1.6, 2.3]} radius={0.35} smoothness={3} position={[36.5, -0.6, 0]} material={hullMat} />
            {/* prong stripe */}
            <mesh position={[39, -0.6, 0]} material={accentMat}>
              <boxGeometry args={[5, 1.64, 2.34]} />
            </mesh>
            <mesh position={[33, -0.6, 0]} material={accentDarkMat}>
              <boxGeometry args={[0.6, 1.64, 2.34]} />
            </mesh>
            {/* Whipple bumper stack */}
            {[0, 1, 2, 3].map((i) => (
              <mesh key={i} position={[44.6 + i * 0.45, -0.6, 0]} material={i % 2 ? hullDarkMat : hullMidMat}>
                <boxGeometry args={[0.18, 1.9 - i * 0.2, 2.6 - i * 0.25]} />
              </mesh>
            ))}
            {/* ionising laser emitter */}
            <mesh position={[46.4, -0.6, 0]} rotation={[0, 0, -PI / 2]} material={glowCyanMat}>
              <cylinderGeometry args={[0.35, 0.2, 0.4, 12]} />
            </mesh>
            {/* RCS quad */}
            <group position={[42, -0.6, 0]}>
              {[
                [0, 1, 0],
                [0, -1, 0],
                [0, 0, s],
              ].map((d, i) => (
                <mesh
                  key={i}
                  position={[0, d[1] * 0.95, d[2] * 1.3]}
                  rotation={[d[2] ? (PI / 2) * -s : 0, 0, d[1] ? 0 : 0]}
                  material={hullDarkMat}
                >
                  <cylinderGeometry args={[0.18, 0.3, 0.5, 10]} />
                </mesh>
              ))}
            </group>
            {/* prong-to-body pylon */}
            <mesh position={[30, -0.6, -1.2 * s]} material={hullDarkMat}>
              <boxGeometry args={[3, 1.2, 1.4]} />
            </mesh>
            {/* glow strip */}
            <mesh position={[37, 0.22, 1.16 * s]} material={glowBlueMat}>
              <boxGeometry args={[10, 0.08, 0.06]} />
            </mesh>
          </Part>
        </group>
      ))}

      {/* magnetic deflector coil */}
      <Part id="deflector">
        <mesh position={[40, 0, 0]} rotation={[0, PI / 2, 0]} material={hullDarkMat}>
          <torusGeometry args={[7, 0.5, 12, 64]} />
        </mesh>
        <mesh position={[40.2, 0, 0]} rotation={[0, PI / 2, 0]} material={glowCyanMat}>
          <torusGeometry args={[7, 0.2, 8, 64]} />
        </mesh>
        {/* emitter nodes */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * PI * 2;
          return (
            <mesh key={i} position={[40, Math.cos(a) * 7, Math.sin(a) * 7]} rotation={[a, 0, 0]} material={hullMidMat}>
              <boxGeometry args={[1.1, 1.3, 0.9]} />
            </mesh>
          );
        })}
        {/* struts to prongs */}
        {[-1, 1].map((s) => (
          <group key={s}>
            <mesh position={[40, 2.05, 5.3 * s]} material={hullDarkMat}>
              <boxGeometry args={[0.5, 5.3, 0.4]} />
            </mesh>
            <mesh position={[40, -2.65, 5.3 * s]} material={hullDarkMat}>
              <boxGeometry args={[0.5, 4.1, 0.4]} />
            </mesh>
          </group>
        ))}
      </Part>
    </group>
  );
}

// ---------------------------------------------------------------- WINGS + NACELLES
function wingShape() {
  const s = new THREE.Shape();
  s.moveTo(26, 5.4);
  s.lineTo(22, 7.5);
  s.lineTo(6, 28);
  s.lineTo(-6, 28);
  s.lineTo(-2, 16);
  s.lineTo(4, 5.4);
  s.closePath();
  return s;
}

function Nacelle() {
  const coils = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!coils.current) return;
    coils.current.children.forEach((c, i) => {
      const m = (c as THREE.Mesh).material as THREE.MeshStandardMaterial;
      const t = anim.time * (2 + anim.warp * 6) - i * 0.7;
      m.emissiveIntensity = 1.4 + Math.sin(t) * 0.6 + anim.warp * 3;
    });
  });
  const coilMats = useMemo(
    () => Array.from({ length: 6 }).map(() => glowBlueMat.clone()),
    [],
  );
  return (
    <group position={[0, 0, 28]}>
      <mesh rotation={[0, 0, PI / 2]} material={hullDarkMat}>
        <cylinderGeometry args={[1.7, 1.7, 20, 24]} />
      </mesh>
      {/* intake cone */}
      <mesh position={[12, 0, 0]} rotation={[0, 0, -PI / 2]} material={hullMat}>
        <coneGeometry args={[1.7, 4, 24]} />
      </mesh>
      <mesh position={[10.4, 0, 0]} rotation={[0, PI / 2, 0]} material={glowCyanMat}>
        <torusGeometry args={[1.72, 0.1, 8, 32]} />
      </mesh>
      {/* aft cap + exhaust glow */}
      <mesh position={[-11, 0, 0]} rotation={[0, 0, PI / 2]} material={hullMidMat}>
        <cylinderGeometry args={[1.3, 1.7, 2, 24]} />
      </mesh>
      <mesh position={[-12.05, 0, 0]} rotation={[0, 0, PI / 2]} material={glowBlueMat}>
        <cylinderGeometry args={[1.1, 1.1, 0.1, 24]} />
      </mesh>
      {/* warp field coils */}
      <group ref={coils}>
        {coilMats.map((m, i) => (
          <mesh key={i} position={[-7.5 + i * 2.6, 0, 0]} rotation={[0, PI / 2, 0]} material={m}>
            <torusGeometry args={[2.05, 0.24, 10, 40]} />
          </mesh>
        ))}
      </group>
      {/* coil housings */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[-7.5 + i * 2.6, 0, 0]} rotation={[0, PI / 2, 0]} material={hullMidMat}>
          <torusGeometry args={[2.05, 0.42, 6, 8]} />
        </mesh>
      ))}
      {/* accent rings */}
      <mesh position={[8.6, 0, 0]} rotation={[0, PI / 2, 0]} material={accentMat}>
        <torusGeometry args={[1.72, 0.14, 8, 32]} />
      </mesh>
      <mesh position={[-9.4, 0, 0]} rotation={[0, PI / 2, 0]} material={accentMat}>
        <torusGeometry args={[1.72, 0.14, 8, 32]} />
      </mesh>
      {/* spine glow strip */}
      <mesh position={[0, 0.9, 1.5]} material={glowBlueMat}>
        <boxGeometry args={[16, 0.14, 0.14]} />
      </mesh>
      <mesh position={[0, -0.9, 1.5]} material={glowBlueMat}>
        <boxGeometry args={[16, 0.14, 0.14]} />
      </mesh>
      {/* pylon fairing */}
      <mesh position={[0, 0, -1.6]} material={hullMat}>
        <boxGeometry args={[11, 1.4, 1.2]} />
      </mesh>
    </group>
  );
}

function Wing({ side }: { side: 1 | -1 }) {
  const shape = useMemo(() => wingShape(), []);
  return (
    <group scale={[1, 1, side]} rotation={[0.1 * side, 0, 0]}>
      {/* main wing surface */}
      <mesh rotation={[PI / 2, 0, 0]} position={[0, 0.6, 0]} material={hullMat}>
        <extrudeGeometry args={[shape, { depth: 1.2, bevelEnabled: true, bevelThickness: 0.25, bevelSize: 0.3, bevelSegments: 2 }]} />
      </mesh>
      {/* leading edge stripe */}
      <mesh position={[15.3, 0.88, 16.2]} rotation={[0, -2.235, 0]} material={accentMat}>
        <boxGeometry args={[26, 0.06, 1.3]} />
      </mesh>
      <mesh position={[15.3, -0.88, 16.2]} rotation={[0, -2.235, 0]} material={accentMat}>
        <boxGeometry args={[26, 0.06, 1.3]} />
      </mesh>
      {/* trailing edge glow */}
      <mesh position={[-3.2, 0, 17]} rotation={[0, -1.9, 0]} material={glowBlueMat}>
        <boxGeometry args={[23, 0.3, 0.1]} />
      </mesh>
      {/* wing root fairing */}
      <RoundedBox args={[16, 2.6, 4]} radius={0.5} position={[13, 0, 7]} material={hullMidMat} />
      {/* wing spar ridge */}
      <mesh position={[8, 0.95, 14]} rotation={[0, -0.85, 0]} material={hullMidMat}>
        <boxGeometry args={[14, 0.5, 0.9]} />
      </mesh>
      {/* nacelle */}
      <Part id="nacelles">
        <Nacelle />
      </Part>
      {/* nav light */}
      <mesh position={[-6.5, 0, 29.8]} material={side > 0 ? navGreenMat : navRedMat}>
        <sphereGeometry args={[0.28, 10, 8]} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------- GREEBLES + WINDOWS (instanced)
function Greebles() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 260;
  useLayoutEffect(() => {
    if (!ref.current) return;
    const r = rng(42);
    const m = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const zone = r();
      let x = 0,
        y = 0,
        z = 0;
      const sx = 0.4 + r() * 1.6;
      const sy = 0.15 + r() * 0.5;
      const sz = 0.4 + r() * 1.4;
      if (zone < 0.45) {
        // forward body top / bottom
        x = 6 + r() * 22;
        z = (r() - 0.5) * 8.5;
        y = r() < 0.6 ? 3.25 + sy / 2 : -3.25 - sy / 2;
        if (Math.abs(z) < 2.3 && y > 0) z += 2.6 * Math.sign(z || 1);
      } else if (zone < 0.8) {
        // engineering block
        x = -29 + r() * 12;
        z = (r() - 0.5) * 8;
        y = r() < 0.5 ? 4.75 + sy / 2 : -4.75 - sy / 2;
      } else {
        // body sides
        x = 6 + r() * 22;
        y = (r() - 0.5) * 4.5;
        z = (r() < 0.5 ? 1 : -1) * (5.5 + sy / 2);
      }
      m.position.set(x, y, z);
      m.rotation.set(0, 0, 0);
      m.scale.set(sx, sy, sz);
      if (Math.abs(z) > 5) m.scale.set(sx, sz, sy);
      m.updateMatrix();
      ref.current.setMatrixAt(i, m.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} material={hullDarkMat}>
      <boxGeometry args={[1, 1, 1]} />
    </instancedMesh>
  );
}

function BodyWindows() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const rows = [-2.1, 0.1, 2.3];
  const cols = 17;
  const count = rows.length * cols * 2;
  useLayoutEffect(() => {
    if (!ref.current) return;
    const m = new THREE.Object3D();
    let i = 0;
    for (const side of [-1, 1]) {
      for (const y of rows) {
        for (let c = 0; c < cols; c++) {
          m.position.set(7 + c * 1.25, y, side * 5.58);
          m.scale.set(0.55, 0.32, 0.1);
          m.updateMatrix();
          ref.current.setMatrixAt(i++, m.matrix);
        }
      }
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} material={windowMat}>
      <boxGeometry args={[1, 1, 1]} />
    </instancedMesh>
  );
}

function NavStrobes() {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const t = anim.time % 1.6;
    const aOn = t < 0.08 || (t > 0.2 && t < 0.28);
    const bOn = t > 0.8 && t < 0.9;
    if (a.current) {
      a.current.visible = aOn;
      (a.current.material as THREE.MeshStandardMaterial).emissiveIntensity = aOn ? 5.5 : 0.4;
    }
    if (b.current) {
      b.current.visible = bOn;
      (b.current.material as THREE.MeshStandardMaterial).emissiveIntensity = bOn ? 5.5 : 0.4;
    }
  });
  return (
    <group>
      <mesh ref={a} position={[17, 4.5, 0]} material={glowWhiteMat}>
        <sphereGeometry args={[0.3, 10, 8]} />
      </mesh>
      <mesh ref={b} position={[-30, 5.2, 0]} material={navRedMat}>
        <sphereGeometry args={[0.3, 10, 8]} />
      </mesh>
      {/* antenna masts */}
      <mesh position={[17, 4.9, 0]} material={pipeMat}>
        <cylinderGeometry args={[0.05, 0.05, 1.2, 6]} />
      </mesh>
    </group>
  );
}

export function Hull() {
  return (
    <group>
      <Spine />
      <ForwardBody />
      <Nose />
      <Wing side={1} />
      <Wing side={-1} />
      <Greebles />
      <BodyWindows />
      <NavStrobes />
    </group>
  );
}
