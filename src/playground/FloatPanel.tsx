import { useEffect, useRef, type ReactNode } from "react";

export interface PanelPos {
  x: number;
  y: number;
  w: number;
  h?: number;
  open: boolean;
  min?: boolean;
}

/** Çalışma alanının üstünde yüzen, başlığından sürüklenen, köşesinden boyutlanan panel. */
export default function FloatPanel({
  title,
  pos,
  onChange,
  onClose,
  z,
  onFocus,
  children,
}: {
  title: string;
  pos: PanelPos;
  onChange: (p: PanelPos) => void;
  onClose: () => void;
  z: number;
  onFocus: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const posRef = useRef(pos);
  posRef.current = pos;
  const changeRef = useRef(onChange);
  changeRef.current = onChange;

  // köşeden boyutlandırınca boyutu sakla
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let first = true;
    const ro = new ResizeObserver(() => {
      if (first) {
        first = false;
        return;
      }
      if (posRef.current.min) return;
      const r = el.getBoundingClientRect();
      const w = Math.round(r.width);
      const h = Math.round(r.height);
      if (Math.abs(w - posRef.current.w) > 2 || Math.abs(h - (posRef.current.h ?? 0)) > 2) changeRef.current({ ...posRef.current, w, h });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function startDrag(e: React.PointerEvent) {
    if (e.button !== 0) return;
    e.preventDefault();
    onFocus();
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    const pr = parent.getBoundingClientRect();
    const sx = e.clientX;
    const sy = e.clientY;
    const ox = pos.x;
    const oy = pos.y;
    const move = (ev: PointerEvent) => {
      const w = el.offsetWidth;
      const x = Math.min(pr.width - 40, Math.max(-w + 60, ox + ev.clientX - sx));
      const y = Math.min(pr.height - 28, Math.max(0, oy + ev.clientY - sy));
      changeRef.current({ ...posRef.current, x: Math.round(x), y: Math.round(y) });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  return (
    <div
      ref={ref}
      onPointerDown={onFocus}
      className="pg-panel absolute flex flex-col overflow-hidden rounded-xl border border-line bg-panel/95 shadow-2xl backdrop-blur"
      style={{
        left: pos.x,
        top: pos.y,
        width: pos.w,
        height: pos.min ? undefined : pos.h,
        maxHeight: "calc(100% - 8px)",
        zIndex: z,
        resize: pos.min ? "none" : "both",
        minWidth: 170,
        minHeight: pos.min ? undefined : 90,
      }}
    >
      <div
        onPointerDown={startDrag}
        onDoubleClick={() => onChange({ ...pos, min: !pos.min })}
        className="flex shrink-0 cursor-grab items-center gap-2 border-b border-line bg-panel2/80 px-2.5 py-1.5 active:cursor-grabbing"
      >
        <span className="flex-1 truncate font-disp text-[11px] font-semibold uppercase tracking-widest text-mut">{title}</span>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onChange({ ...pos, min: !pos.min })}
          aria-label={pos.min ? "Aç" : "Küçült"}
          className="h-6 w-6 rounded text-mut hover:bg-bg hover:text-ink"
        >
          {pos.min ? "▾" : "▴"}
        </button>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onClose}
          aria-label="Kapat"
          className="h-6 w-6 rounded text-mut hover:bg-bg hover:text-rose-300"
        >
          ✕
        </button>
      </div>
      {!pos.min && <div className="min-h-0 flex-1 overflow-auto p-2.5">{children}</div>}
    </div>
  );
}
