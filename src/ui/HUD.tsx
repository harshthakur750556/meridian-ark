import { useEffect, useState } from 'react';
import { CATEGORIES, PRESETS, SHIP, SYSTEMS, systemById } from '../data/systems';
import { useStore } from '../store';
import { anim } from '../three/anim';
import { cn } from '../utils/cn';

const catColor: Record<string, string> = {
  Command: 'bg-amber-400',
  Propulsion: 'bg-sky-400',
  Power: 'bg-violet-400',
  Habitat: 'bg-green-400',
  'Life Support': 'bg-cyan-400',
  'Structure & Defense': 'bg-red-400',
};

function Toggle({ on, label, onClick, hot }: { on: boolean; label: string; onClick: () => void; hot?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'pointer-events-auto flex items-center gap-2 rounded-sm border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-all',
        on
          ? hot
            ? 'border-cyan-300 bg-cyan-400/25 text-cyan-50 shadow-[0_0_18px_rgba(34,211,238,0.55)]'
            : 'border-amber-300/80 bg-amber-400/20 text-amber-50'
          : 'border-white/15 bg-black/40 text-slate-300 hover:border-white/40 hover:bg-black/60',
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', on ? (hot ? 'bg-cyan-300' : 'bg-amber-300') : 'bg-slate-500')} />
      {label}
    </button>
  );
}

function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'pointer-events-auto relative border border-white/10 bg-[#050912]/80 text-slate-200 backdrop-blur-md',
        'before:absolute before:-top-px before:left-0 before:h-px before:w-10 before:bg-cyan-300',
        'after:absolute after:-bottom-px after:right-0 after:h-px after:w-10 after:bg-amber-400',
        className,
      )}
    >
      {children}
    </div>
  );
}

function useTelemetry() {
  const [t, setT] = useState({ warp: 0, rpmA: 0, rpmB: 0, g: 0, reactor: 0, v: 0, temp: 0, cut: 0 });
  useEffect(() => {
    let raf = 0;
    let last = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 120) return;
      last = now;
      const w = anim.warp;
      const rpm = 2.0 * anim.spin;
      const omega = (rpm * 2 * Math.PI) / 60;
      setT({
        warp: w,
        rpmA: rpm,
        rpmB: -rpm,
        g: (omega * omega * 210) / 9.81,
        reactor: 8.0 + w * 3.6 + Math.sin(anim.time * 3) * 0.08,
        v: w < 0.02 ? 0.08 : 0.08 + w * w * 9.4,
        temp: 1100 + w * 260 + Math.sin(anim.time * 1.3) * 6,
        cut: anim.cutaway,
      });
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return t;
}

function Telemetry() {
  const t = useTelemetry();
  const item = (label: string, value: string, warn?: boolean) => (
    <div className="flex min-w-[96px] flex-col gap-0.5">
      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">{label}</span>
      <span className={cn('font-mono text-sm tabular-nums', warn ? 'text-cyan-300' : 'text-slate-100')}>{value}</span>
    </div>
  );
  const warpActive = t.warp > 0.5;
  return (
    <Panel className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2">
      {item('Ring A spin', `${t.rpmA.toFixed(2)} rpm`)}
      {item('Ring B spin', `${t.rpmB.toFixed(2)} rpm`)}
      {item('Ring gravity', `${t.g.toFixed(2)} g`)}
      {item('Reactor', `${t.reactor.toFixed(2)} GW`, warpActive)}
      {item('Radiator T', `${t.temp.toFixed(0)} K`, warpActive)}
      {item('Velocity', warpActive ? `${t.v.toFixed(2)} c (apparent)` : `${t.v.toFixed(3)} c`, warpActive)}
      <div className="flex min-w-[140px] flex-col gap-1">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">Warp field</span>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full transition-all"
            style={{ width: `${Math.round(t.warp * 100)}%`, background: 'linear-gradient(90deg,#06b6d4,#a5f3fc)' }}
          />
        </div>
      </div>
      <div className="ml-auto hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 md:flex">
        <span className={cn('h-1.5 w-1.5 rounded-full', warpActive ? 'animate-pulse bg-cyan-300' : 'bg-green-400')} />
        {warpActive ? 'Bubble stable · metric engineering online' : 'Fusion cruise · all systems nominal'}
      </div>
    </Panel>
  );
}

function HoverTip() {
  const hovered = useStore((s) => s.hovered);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e: PointerEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('pointermove', h);
    return () => window.removeEventListener('pointermove', h);
  }, []);
  if (!hovered) return null;
  const s = systemById[hovered];
  return (
    <div
      className="pointer-events-none fixed z-50 -translate-y-full rounded-sm border border-cyan-300/50 bg-black/80 px-2 py-1 font-mono text-[11px] text-cyan-100"
      style={{ left: pos.x + 14, top: pos.y - 10 }}
    >
      {s?.name}
      <span className="ml-2 text-slate-400">click to inspect</span>
    </div>
  );
}

export function HUD() {
  const { cutaway, warp, labels, spin, selected, toggleCutaway, toggleWarp, toggleLabels, toggleSpin, select, applyPreset } =
    useStore();
  const [listOpen, setListOpen] = useState(false);
  const sys = selected ? systemById[selected] : null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-3 md:p-4">
      {/* -------- top row -------- */}
      <div className="flex items-start justify-between gap-3">
        <Panel className="px-4 py-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300">Generation Ship · Warp Capable</div>
          <h1 className="mt-1 text-xl font-bold tracking-[0.12em] text-white md:text-2xl">{SHIP.name}</h1>
          <div className="font-mono text-[11px] text-slate-400">{SHIP.registry}</div>
          <div className="mt-2 hidden grid-cols-2 gap-x-6 gap-y-0.5 font-mono text-[10px] text-slate-400 md:grid">
            <span>LENGTH <b className="text-slate-200">{SHIP.length}</b></span>
            <span>BEAM <b className="text-slate-200">{SHIP.beam}</b></span>
            <span>MASS <b className="text-slate-200">{SHIP.mass}</b></span>
            <span>CREW <b className="text-slate-200">{SHIP.crew}</b></span>
          </div>
        </Panel>

        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-wrap justify-end gap-2">
            <Toggle on={warp} label="Warp drive" onClick={toggleWarp} hot />
            <Toggle on={cutaway} label="Cutaway" onClick={toggleCutaway} />
            <Toggle on={labels} label="Labels" onClick={toggleLabels} />
            <Toggle on={spin} label="Ring spin" onClick={toggleSpin} />
          </div>
          <div className="flex flex-wrap justify-end gap-1">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className="pointer-events-auto rounded-sm border border-white/10 bg-black/40 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-300 hover:border-cyan-300/60 hover:text-cyan-100"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* -------- middle row -------- */}
      <div className="flex min-h-0 flex-1 items-stretch justify-between gap-3 py-3">
        {/* systems list */}
        <div className="flex max-h-full flex-col">
          <button
            onClick={() => setListOpen((v) => !v)}
            className="pointer-events-auto mb-1 self-start rounded-sm border border-white/10 bg-black/50 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-300 md:hidden"
          >
            {listOpen ? 'Hide systems' : 'Systems ▸'}
          </button>
          <Panel className={cn('w-60 flex-1 overflow-y-auto md:block', listOpen ? 'block' : 'hidden')}>
            <div className="sticky top-0 border-b border-white/10 bg-[#050912]/95 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400">
              Ship systems · {SYSTEMS.length}
            </div>
            {CATEGORIES.map((c) => (
              <div key={c} className="px-2 py-1.5">
                <div className="flex items-center gap-2 px-1 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  <span className={cn('h-1.5 w-1.5 rounded-full', catColor[c])} />
                  {c}
                </div>
                {SYSTEMS.filter((s) => s.category === c).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      select(s.id);
                      setListOpen(false);
                    }}
                    className={cn(
                      'block w-full rounded-sm px-2 py-1 text-left text-[12px] transition-colors',
                      selected === s.id ? 'bg-cyan-400/15 text-cyan-100' : 'text-slate-300 hover:bg-white/5 hover:text-white',
                    )}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            ))}
          </Panel>
        </div>

        {/* details */}
        <Panel className="hidden w-80 self-start overflow-y-auto p-4 md:block lg:w-96" >
          {sys ? (
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400">
                <span className={cn('h-1.5 w-1.5 rounded-full', catColor[sys.category])} />
                {sys.category}
              </div>
              <h2 className="mt-1 text-lg font-semibold leading-tight text-white">{sys.name}</h2>
              <p className="mt-1 text-[12px] text-cyan-200/90">{sys.short}</p>
              <p className="mt-3 text-[12px] leading-relaxed text-slate-300">{sys.description}</p>
              <table className="mt-3 w-full border-collapse font-mono text-[11px]">
                <tbody>
                  {sys.specs.map(([k, v]) => (
                    <tr key={k} className="border-t border-white/10">
                      <td className="py-1 pr-2 align-top uppercase tracking-wider text-slate-500">{k}</td>
                      <td className="py-1 text-slate-100">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={() => select(null)}
                className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 hover:text-white"
              >
                ✕ close
              </button>
            </div>
          ) : (
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400">Mission brief</div>
              <h2 className="mt-1 text-lg font-semibold text-white">Interstellar Ark, Alcubierre-class</h2>
              <p className="mt-2 text-[12px] leading-relaxed text-slate-300">
                A 1.2 km generation ship carrying 4,200 colonists across twelve generations. Twin counter-rotating
                habitat rings supply 0.94 g; an aneutronic D-He3 fusion torch drives cruise at 0.08 c; and an
                Alcubierre–White warp ring provides theoretical FTL bursts by contracting spacetime ahead and
                expanding it behind.
              </p>
              <ul className="mt-3 space-y-1 font-mono text-[11px] text-slate-400">
                <li><span className="text-cyan-300">▸</span> Drag to orbit · scroll to zoom · right-drag to pan</li>
                <li><span className="text-cyan-300">▸</span> Click any part of the ship or a label to inspect it</li>
                <li><span className="text-cyan-300">▸</span> Toggle <b className="text-slate-200">Cutaway</b> to see every deck and room</li>
                <li><span className="text-cyan-300">▸</span> Engage <b className="text-slate-200">Warp drive</b> to form the bubble</li>
              </ul>
              <div className="mt-3 border-t border-white/10 pt-2 font-mono text-[10px] text-slate-500">
                Scale: {SHIP.scale} · Cruise: {SHIP.cruise}
              </div>
            </div>
          )}
        </Panel>
      </div>

      {/* -------- bottom -------- */}
      <Telemetry />
      <HoverTip />
    </div>
  );
}
