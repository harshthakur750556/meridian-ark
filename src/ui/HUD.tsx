import { useEffect, useState } from 'react';
import { CATEGORIES, PRESETS, SHIP, SYSTEMS, systemById } from '../data/systems';
import { useStore } from '../store';
import { anim } from '../three/anim';
import { cn } from '../utils/cn';

const catColor: Record<string, string> = {
  Command: 'var(--hud-cyan)',
  Propulsion: 'var(--hud-orange)',
  Power: '#c084fc',
  Habitat: '#86efac',
  'Life Support': '#67e8f9',
  'Structure & Defense': '#fb7185',
};

function Panel({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn('hud-panel pointer-events-auto', className)}>{children}</section>;
}

function IconButton({ active, label, onClick, children }: { active: boolean; label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn('hud-icon-button', active && 'hud-icon-button-active')}
    >
      <span className="hud-icon">{children}</span>
      <span className="hud-button-label">{label}</span>
    </button>
  );
}

function useTelemetry() {
  const [t, setT] = useState({ warp: 0, rpm: 0, g: 0, reactor: 0, velocity: 0, temp: 0 });
  useEffect(() => {
    let raf = 0;
    let last = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 100) return;
      last = now;
      const rpm = 2 * anim.spin;
      const omega = (rpm * 2 * Math.PI) / 60;
      setT({
        warp: anim.warp,
        rpm,
        g: (omega * omega * 210) / 9.81,
        reactor: 8 + anim.warp * 3.6 + Math.sin(anim.time * 3) * 0.08,
        velocity: anim.warp < 0.02 ? 0.08 : 0.08 + anim.warp * anim.warp * 9.4,
        temp: 1100 + anim.warp * 260 + Math.sin(anim.time * 1.3) * 6,
      });
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return t;
}

function Telemetry() {
  const t = useTelemetry();
  const active = t.warp > 0.5;
  const stats = [
    ['RING A', `${t.rpm.toFixed(2)} RPM`],
    ['RING B', `${(-t.rpm).toFixed(2)} RPM`],
    ['GRAVITY', `${t.g.toFixed(2)} G`],
    ['REACTOR', `${t.reactor.toFixed(2)} GW`],
    ['RADIATOR', `${t.temp.toFixed(0)} K`],
    ['VELOCITY', active ? `${t.velocity.toFixed(2)} C` : `${t.velocity.toFixed(3)} C`],
  ];
  return (
    <Panel className="hud-telemetry">
      <div className="hud-telemetry-title"><span className="hud-live-dot" /> FLIGHT TELEMETRY <span className="hud-telemetry-time">T+ {anim.time.toFixed(1)} SEC</span></div>
      <div className="hud-stat-grid">
        {stats.map(([label, value]) => <div className="hud-stat" key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </div>
      <div className="hud-warp-line"><span>WARP FIELD</span><div><i style={{ width: `${t.warp * 100}%` }} /></div><b>{Math.round(t.warp * 100).toString().padStart(3, '0')}%</b></div>
    </Panel>
  );
}

function SystemsPanel({ selected, onSelect }: { selected: string | null; onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="hud-systems-wrap">
      <button className="hud-mobile-trigger pointer-events-auto" onClick={() => setOpen((v) => !v)}>{open ? 'CLOSE SYSTEMS' : 'SYSTEMS INDEX'} <span>{open ? '−' : '+'}</span></button>
      <Panel className={cn('hud-systems', open && 'hud-systems-open')}>
        <div className="hud-panel-heading"><span>01</span> SYSTEMS INDEX <b>{SYSTEMS.length.toString().padStart(2, '0')}</b></div>
        <div className="hud-system-scroll">
          {CATEGORIES.map((category) => (
            <div key={category} className="hud-category">
              <div className="hud-category-title"><i style={{ background: catColor[category] }} />{category}</div>
              {SYSTEMS.filter((s) => s.category === category).map((system) => (
                <button key={system.id} onClick={() => { onSelect(system.id); setOpen(false); }} className={cn('hud-system-item', selected === system.id && 'hud-system-selected')}>
                  <span>{system.name}</span><b>›</b>
                </button>
              ))}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Details({ selected, close }: { selected: string | null; close: () => void }) {
  const sys = selected ? systemById[selected] : null;
  return (
    <Panel className={cn('hud-details', sys && 'hud-details-active')}>
      {sys ? (
        <>
          <div className="hud-detail-kicker"><i style={{ background: catColor[sys.category] }} /> {sys.category} / {sys.id}</div>
          <h2>{sys.name}</h2><p className="hud-detail-short">{sys.short}</p><p className="hud-detail-description">{sys.description}</p>
          <div className="hud-specs">{sys.specs.map(([key, value]) => <div key={key}><span>{key}</span><b>{value}</b></div>)}</div>
          <button className="hud-close" onClick={close}>ESC / CLOSE <span>×</span></button>
        </>
      ) : (
        <>
          <div className="hud-detail-kicker"><i className="hud-orange-dot" /> MISSION BRIEF / ACTIVE</div>
          <h2>MERIDIAN ARK</h2>
          <p className="hud-detail-short">Interstellar habitat vessel · Alcubierre-class</p>
          <p className="hud-detail-description">A 1,200 metre generation ship carrying 4,200 colonists across twelve generations. Select a system from the index or click the vessel to inspect its architecture.</p>
          <div className="hud-brief-grid"><span>MISSION</span><b>ORIGIN → KEPLER-186F</b><span>CRUISE</span><b>0.08 C / FUSION TORCH</b><span>SCALE</span><b>{SHIP.scale}</b></div>
        </>
      )}
    </Panel>
  );
}

function HoverTip() {
  const hovered = useStore((s) => s.hovered);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: PointerEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);
  if (!hovered || !systemById[hovered]) return null;
  return <div className="hud-hover-tip" style={{ left: pos.x + 18, top: pos.y - 12 }}><span />{systemById[hovered].name}<small>CLICK TO LOCK</small></div>;
}

export function HUD() {
  const { cutaway, warp, labels, spin, selected, toggleCutaway, toggleWarp, toggleLabels, toggleSpin, select, applyPreset } = useStore();
  return (
    <div className="hud-shell">
      <div className="hud-topline"><span>MERIDIAN FLIGHT SYSTEMS</span><b>MK-IV / REMOTE OBSERVATION</b></div>
      <header className="hud-header">
        <div className="hud-brand"><div className="hud-brand-mark">M</div><div><span>ISV // GENERATION VESSEL</span><h1>{SHIP.name}</h1><small>{SHIP.registry}</small></div></div>
        <div className="hud-actions">
          <IconButton active={warp} label="Warp" onClick={toggleWarp}>W</IconButton>
          <IconButton active={cutaway} label="Cutaway" onClick={toggleCutaway}>C</IconButton>
          <IconButton active={labels} label="Labels" onClick={toggleLabels}>L</IconButton>
          <IconButton active={spin} label="Spin" onClick={toggleSpin}>S</IconButton>
        </div>
      </header>
      <div className="hud-main">
        <SystemsPanel selected={selected} onSelect={select} />
        <div className="hud-center-readout"><span className="hud-crosshair" /><span>EXTERIOR VISUALIZATION</span><b>FREE ORBIT // ONLINE</b></div>
        <Details selected={selected} close={() => select(null)} />
      </div>
      <div className="hud-bottom">
        <div className="hud-presets"><span>VIEWPOINTS</span>{PRESETS.map((preset, index) => <button key={preset.id} onClick={() => applyPreset(preset.id)}><b>{String(index + 1).padStart(2, '0')}</b>{preset.name}</button>)}</div>
        <Telemetry />
      </div>
      <HoverTip />
    </div>
  );
}
