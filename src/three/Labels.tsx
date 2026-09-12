import { Html } from '@react-three/drei';
import { SYSTEMS } from '../data/systems';
import { useStore } from '../store';

const catColor: Record<string, string> = {
  Command: '#f59e0b',
  Propulsion: '#38bdf8',
  Power: '#a78bfa',
  Habitat: '#4ade80',
  'Life Support': '#22d3ee',
  'Structure & Defense': '#f87171',
};

export function Labels() {
  const labels = useStore((s) => s.labels);
  const selected = useStore((s) => s.selected);
  const select = useStore((s) => s.select);
  if (!labels) return null;
  return (
    <group>
      {SYSTEMS.map((s) => {
        const active = selected === s.id;
        return (
          <Html key={s.id} position={s.label} center distanceFactor={30} zIndexRange={[5, 0]} style={{ pointerEvents: 'auto' }}>
            <button
              onClick={() => select(s.id)}
              className={`group flex items-center gap-1.5 whitespace-nowrap rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider backdrop-blur-sm transition-all ${
                active
                  ? 'border-cyan-300 bg-cyan-400/20 text-cyan-100 shadow-[0_0_14px_rgba(34,211,238,0.6)]'
                  : 'border-white/15 bg-black/45 text-slate-200 hover:border-white/50 hover:bg-black/70'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: catColor[s.category] }} />
              {s.name}
            </button>
          </Html>
        );
      })}
    </group>
  );
}
