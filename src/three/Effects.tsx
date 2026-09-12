import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useStore } from '../store';
import { anim } from './anim';
import { hullMaterials } from './materials';

// ---------------------------------------------------------------- TICKER
export function Ticker() {
  const warp = useStore((s) => s.warp);
  const cutaway = useStore((s) => s.cutaway);
  const spin = useStore((s) => s.spin);
  useFrame((state, dt) => {
    anim.time = state.clock.elapsedTime;
    const k = 1 - Math.exp(-Math.min(dt, 0.1) * 2.2);
    anim.warp += ((warp ? 1 : 0) - anim.warp) * k;
    anim.cutaway += ((cutaway ? 1 : 0) - anim.cutaway) * k * 1.6;
    anim.spin += ((spin ? 1 : 0) - anim.spin) * k;
    const op = 1 - anim.cutaway * 0.9;
    for (const m of hullMaterials) {
      const transparent = op < 0.995;
      if (m.transparent !== transparent) m.transparent = transparent;
      m.opacity = op;
      m.depthWrite = op > 0.5;
    }
  });
  return null;
}

// ---------------------------------------------------------------- WARP BUBBLE
const bubbleVert = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;
const bubbleFrag = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec2 vUv;
  void main() {
    float f = 1.0 - abs(dot(normalize(vNormal), normalize(vView)));
    f = pow(f, 4.0);
    float bands = 0.5 + 0.5 * sin(vUv.y * 90.0 + vUv.x * 12.0 - uTime * 7.0);
    float grid = smoothstep(0.9, 1.0, bands) * 0.5;
    float flow = 0.5 + 0.5 * sin(vUv.x * 40.0 - uTime * 12.0);
    vec3 col = mix(vec3(0.15, 0.55, 1.0), vec3(0.75, 0.95, 1.0), f);
    float a = (f * 0.55 + grid * f * 1.2 + flow * f * 0.15) * uIntensity;
    gl_FragColor = vec4(col * a, a);
  }
`;

export function WarpBubble() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: bubbleVert,
        fragmentShader: bubbleFrag,
        uniforms: { uTime: { value: 0 }, uIntensity: { value: 0 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    [],
  );
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(() => {
    mat.uniforms.uTime.value = anim.time;
    mat.uniforms.uIntensity.value = anim.warp;
    if (mesh.current) {
      mesh.current.visible = anim.warp > 0.01;
      const s = 0.85 + anim.warp * 0.15;
      mesh.current.scale.set(60 * s, 30 * s, 46 * s);
    }
  });
  return (
    <mesh ref={mesh} position={[2, 0, 0]} material={mat}>
      <sphereGeometry args={[1, 64, 48]} />
    </mesh>
  );
}

// ---------------------------------------------------------------- STAR STREAKS
export function WarpStreaks() {
  const N = 900;
  const { geo, pos, seeds } = useMemo(() => {
    const pos = new Float32Array(N * 6);
    const col = new Float32Array(N * 6);
    const seeds = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 10 + Math.sqrt(Math.random()) * 170;
      seeds[i * 3] = Math.random() * 600 - 300;
      seeds[i * 3 + 1] = Math.cos(a) * r;
      seeds[i * 3 + 2] = Math.sin(a) * r;
      col[i * 6] = 0.75;
      col[i * 6 + 1] = 0.9;
      col[i * 6 + 2] = 1.0;
      col[i * 6 + 3] = 0.0;
      col[i * 6 + 4] = 0.02;
      col[i * 6 + 5] = 0.12;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return { geo, pos, seeds };
  }, []);
  const mat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );
  const lines = useRef<THREE.LineSegments>(null);
  useFrame((_, dt) => {
    const w = anim.warp;
    mat.opacity = Math.min(1, w * 1.5);
    if (lines.current) lines.current.visible = w > 0.02;
    if (w <= 0.02) return;
    const speed = 30 + w * w * 520;
    const len = Math.min(3 + speed * 0.09, 60);
    const d = Math.min(dt, 0.05);
    for (let i = 0; i < N; i++) {
      let x = seeds[i * 3] - speed * d;
      if (x < -320) x += 640;
      seeds[i * 3] = x;
      const y = seeds[i * 3 + 1];
      const z = seeds[i * 3 + 2];
      pos[i * 6] = x;
      pos[i * 6 + 1] = y;
      pos[i * 6 + 2] = z;
      pos[i * 6 + 3] = x + len;
      pos[i * 6 + 4] = y;
      pos[i * 6 + 5] = z;
    }
    geo.attributes.position.needsUpdate = true;
  });
  return <lineSegments ref={lines} geometry={geo} material={mat} frustumCulled={false} />;
}

// ---------------------------------------------------------------- STARFIELD + NEBULA
const nebulaFrag = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vec3 d = normalize(vPos);
    float band = exp(-pow(d.y * 3.0, 2.0));
    vec3 base = vec3(0.004, 0.005, 0.014);
    vec3 milky = vec3(0.035, 0.03, 0.07) * band;
    float blob1 = exp(-pow(length(d - normalize(vec3(-0.6, 0.3, 0.7))) * 2.4, 2.0));
    float blob2 = exp(-pow(length(d - normalize(vec3(0.7, -0.2, -0.5))) * 2.8, 2.0));
    vec3 col = base + milky + vec3(0.12, 0.04, 0.16) * blob1 * 0.35 + vec3(0.02, 0.09, 0.16) * blob2 * 0.35;
    gl_FragColor = vec4(col, 1.0);
  }
`;
const nebulaVert = /* glsl */ `
  varying vec3 vPos;
  void main() { vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

export function Space() {
  const stars = useRef<THREE.Group>(null);
  const nebula = useMemo(
    () => new THREE.ShaderMaterial({ vertexShader: nebulaVert, fragmentShader: nebulaFrag, side: THREE.BackSide, depthWrite: false }),
    [],
  );
  useFrame(() => {
    if (stars.current) stars.current.visible = anim.warp < 0.7;
  });
  return (
    <group>
      <mesh material={nebula} frustumCulled={false}>
        <sphereGeometry args={[900, 32, 24]} />
      </mesh>
      <group ref={stars}>
        <Stars radius={400} depth={200} count={6000} factor={5} saturation={0.2} fade speed={0.4} />
      </group>
      <WarpStreaks />
    </group>
  );
}
