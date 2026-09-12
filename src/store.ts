import { create } from 'zustand';
import { CameraSpot, PRESETS, systemById } from './data/systems';

interface ShipState {
  cutaway: boolean;
  warp: boolean;
  labels: boolean;
  spin: boolean;
  selected: string | null;
  hovered: string | null;
  focus: CameraSpot;
  focusVersion: number;
  toggleCutaway: () => void;
  toggleWarp: () => void;
  toggleLabels: () => void;
  toggleSpin: () => void;
  select: (id: string | null) => void;
  setHovered: (id: string | null) => void;
  flyTo: (spot: CameraSpot) => void;
  applyPreset: (id: string) => void;
}

export const useStore = create<ShipState>((set, get) => ({
  cutaway: false,
  warp: false,
  labels: true,
  spin: true,
  selected: null,
  hovered: null,
  focus: PRESETS[0].camera,
  focusVersion: 0,
  toggleCutaway: () => set((s) => ({ cutaway: !s.cutaway })),
  toggleWarp: () => set((s) => ({ warp: !s.warp })),
  toggleLabels: () => set((s) => ({ labels: !s.labels })),
  toggleSpin: () => set((s) => ({ spin: !s.spin })),
  setHovered: (id) => set({ hovered: id }),
  flyTo: (spot) => set((s) => ({ focus: spot, focusVersion: s.focusVersion + 1 })),
  select: (id) => {
    if (!id) {
      set({ selected: null });
      return;
    }
    const sys = systemById[id];
    if (!sys) return;
    const patch: Partial<ShipState> = { selected: id };
    if (sys.cutaway) patch.cutaway = true;
    set(patch);
    get().flyTo(sys.camera);
  },
  applyPreset: (id) => {
    const p = PRESETS.find((x) => x.id === id);
    if (!p) return;
    set({ cutaway: !!p.cutaway, selected: null });
    get().flyTo(p.camera);
  },
}));
