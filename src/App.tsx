import { Scene } from './three/Scene';
import { HUD } from './ui/HUD';

export default function App() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#02030a] text-slate-100 select-none">
      <Scene />
      <HUD />
      {/* corner brackets */}
      <div className="pointer-events-none absolute inset-2 border border-white/5" />
      <div className="pointer-events-none absolute left-2 top-2 h-5 w-5 border-l-2 border-t-2 border-cyan-300/70" />
      <div className="pointer-events-none absolute right-2 top-2 h-5 w-5 border-r-2 border-t-2 border-cyan-300/70" />
      <div className="pointer-events-none absolute bottom-2 left-2 h-5 w-5 border-b-2 border-l-2 border-amber-400/70" />
      <div className="pointer-events-none absolute bottom-2 right-2 h-5 w-5 border-b-2 border-r-2 border-amber-400/70" />
    </div>
  );
}
