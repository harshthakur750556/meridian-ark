import * as THREE from 'three';

// ---- Exterior hull materials (these fade out in cutaway mode) ----
export const hullMat = new THREE.MeshStandardMaterial({ color: '#d7dbe2', metalness: 0.75, roughness: 0.32 });
export const hullDarkMat = new THREE.MeshStandardMaterial({ color: '#3b4250', metalness: 0.85, roughness: 0.42 });
export const hullMidMat = new THREE.MeshStandardMaterial({ color: '#8a929f', metalness: 0.8, roughness: 0.38 });
export const accentMat = new THREE.MeshStandardMaterial({ color: '#e8672a', metalness: 0.55, roughness: 0.42 });
export const accentDarkMat = new THREE.MeshStandardMaterial({ color: '#8d3a16', metalness: 0.6, roughness: 0.5 });
export const glassMat = new THREE.MeshPhysicalMaterial({
  color: '#8fd3ff',
  metalness: 0.1,
  roughness: 0.05,
  transparent: true,
  opacity: 0.45,
  emissive: '#1f6fbf',
  emissiveIntensity: 0.25,
});
export const radiatorMat = new THREE.MeshStandardMaterial({
  color: '#3a1a14',
  emissive: '#ff3b10',
  emissiveIntensity: 0.55,
  metalness: 0.3,
  roughness: 0.7,
  side: THREE.DoubleSide,
});

export const hullMaterials = [hullMat, hullDarkMat, hullMidMat, accentMat, accentDarkMat, radiatorMat];

// ---- Emissive / glow materials ----
export const glowBlueMat = new THREE.MeshStandardMaterial({ color: '#0b3a66', emissive: '#37b6ff', emissiveIntensity: 2.4 });
export const glowCyanMat = new THREE.MeshStandardMaterial({ color: '#053b40', emissive: '#3ff8ff', emissiveIntensity: 2.0 });
export const glowOrangeMat = new THREE.MeshStandardMaterial({ color: '#4a1a00', emissive: '#ff8a2a', emissiveIntensity: 2.2 });
export const glowWhiteMat = new THREE.MeshStandardMaterial({ color: '#fff', emissive: '#fff8e8', emissiveIntensity: 1.6 });
export const plasmaMat = new THREE.MeshStandardMaterial({ color: '#2b0b4a', emissive: '#c56bff', emissiveIntensity: 3 });
export const windowMat = new THREE.MeshStandardMaterial({ color: '#fff3d6', emissive: '#ffd89a', emissiveIntensity: 1.4 });
export const navRedMat = new THREE.MeshStandardMaterial({ color: '#f00', emissive: '#ff2020', emissiveIntensity: 4 });
export const navGreenMat = new THREE.MeshStandardMaterial({ color: '#0f0', emissive: '#30ff60', emissiveIntensity: 4 });

// ---- Interior materials ----
export const floorMat = new THREE.MeshStandardMaterial({ color: '#4b5563', metalness: 0.3, roughness: 0.8 });
export const wallMat = new THREE.MeshStandardMaterial({ color: '#cbd5e1', metalness: 0.2, roughness: 0.8, side: THREE.DoubleSide });
export const consoleMat = new THREE.MeshStandardMaterial({ color: '#1f2937', metalness: 0.6, roughness: 0.5 });
export const screenMat = new THREE.MeshStandardMaterial({ color: '#031c2c', emissive: '#22c1ff', emissiveIntensity: 1.5 });
export const plantMat = new THREE.MeshStandardMaterial({ color: '#2f9e44', roughness: 0.9 });
export const soilMat = new THREE.MeshStandardMaterial({ color: '#5b4636', roughness: 1 });
export const waterMat = new THREE.MeshPhysicalMaterial({ color: '#1e90ff', transparent: true, opacity: 0.55, roughness: 0.1, metalness: 0.1 });
export const medMat = new THREE.MeshStandardMaterial({ color: '#f1f5f9', roughness: 0.6 });
export const cargoMat = new THREE.MeshStandardMaterial({ color: '#b45309', metalness: 0.4, roughness: 0.6 });
export const pipeMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', metalness: 0.9, roughness: 0.3 });
export const coilMat = new THREE.MeshStandardMaterial({ color: '#b87333', metalness: 0.95, roughness: 0.25 });
export const cryoMat = new THREE.MeshStandardMaterial({ color: '#e0f2fe', metalness: 0.6, roughness: 0.2, emissive: '#7dd3fc', emissiveIntensity: 0.25 });
export const quartersMat = new THREE.MeshStandardMaterial({ color: '#f59e0b', roughness: 0.8 });
export const parkMat = new THREE.MeshStandardMaterial({ color: '#22c55e', roughness: 0.9 });
export const schoolMat = new THREE.MeshStandardMaterial({ color: '#60a5fa', roughness: 0.8 });
export const workshopMat = new THREE.MeshStandardMaterial({ color: '#9ca3af', roughness: 0.7, metalness: 0.4 });
export const shuttleMat = new THREE.MeshStandardMaterial({ color: '#e5e7eb', metalness: 0.7, roughness: 0.3 });
