// ── Netzsysteme übersicht şemaları ──────────────────────────────────────────
// Trafo → hat → bina girişi (HAK) → cihaz. Hangi iletken nereden geliyor,
// PEN nerede ayrılıyor, topraklama nerede — tek bakışta.

const COL = {
  l1: "#e8b07a", // kahverengi (L1)
  l2: "#cbd5e1", // "siyah" (koyu temada açık gri temsil)
  l3: "#94a3b8", // gri (L3)
  n: "#60a5fa", // mavi
  pe: "#4ade80", // yeşil (üstüne sarı kesik çizgi biner → yeşil-sarı)
  peDash: "#fde047",
  box: "#8b9aad",
  text: "#c7d2e0",
  mut: "#7d8da0",
  hot: "#fbbf24",
};

export type NetzSystem = "tn-c" | "tn-s" | "tn-c-s" | "tt" | "it";

function Earth({ x, y, label }: { x: number; y: number; label?: string }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y + 12} stroke={COL.pe} strokeWidth={2} />
      <line x1={x - 11} y1={y + 12} x2={x + 11} y2={y + 12} stroke={COL.pe} strokeWidth={2.5} />
      <line x1={x - 7} y1={y + 17} x2={x + 7} y2={y + 17} stroke={COL.pe} strokeWidth={2.5} />
      <line x1={x - 3} y1={y + 22} x2={x + 3} y2={y + 22} stroke={COL.pe} strokeWidth={2.5} />
      {label && (
        <text x={x} y={y + 34} textAnchor="middle" fill={COL.mut} fontSize={9}>
          {label}
        </text>
      )}
    </g>
  );
}

/** Yeşil-sarı iletken: yeşil taban + sarı kesik üst çizgi. PEN'e mavi uç işareti eklenir. */
function GY({ d, pen }: { d: string; pen?: boolean }) {
  return (
    <g>
      <path d={d} fill="none" stroke={COL.pe} strokeWidth={3} />
      <path d={d} fill="none" stroke={COL.peDash} strokeWidth={3} strokeDasharray="7 7" />
      {pen && <path d={d} fill="none" stroke={COL.n} strokeWidth={3} strokeDasharray="2 26" />}
    </g>
  );
}

const LY = { l1: 48, l2: 68, l3: 88, n: 128, pe: 152 };
const X = { trafoEnd: 150, hak: 430, dev: 580 };

function Label({ x, y, c, t }: { x: number; y: number; c: string; t: string }) {
  return (
    <text x={x} y={y} fill={c} fontSize={11} fontWeight={600}>
      {t}
    </text>
  );
}

export function NetzDiagram({ sys }: { sys: NetzSystem }) {
  const penToHak = sys === "tn-c" || sys === "tn-c-s";
  const penToDevice = sys === "tn-c";
  const split = sys === "tn-c-s";
  const nFromTrafo = sys === "tn-s" || sys === "tt";
  const peFromTrafo = sys === "tn-s";
  const localEarth = sys === "tt" || sys === "it";

  const H = 300;
  const W = 720;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`${sys.toUpperCase()} şeması`}>
      {/* ── Trafo bölgesi ── */}
      <rect x={12} y={20} width={X.trafoEnd - 4} height={220} rx={10} fill="none" stroke={COL.box} strokeDasharray="5 4" opacity={0.5} />
      <text x={12 + (X.trafoEnd - 4) / 2} y={38} textAnchor="middle" fill={COL.text} fontSize={11} fontWeight={600}>
        Trafo istasyonu
      </text>
      <text x={12 + (X.trafoEnd - 4) / 2} y={51} textAnchor="middle" fill={COL.mut} fontSize={9}>
        Ortsnetzstation
      </text>
      {/* sekonder sargı: yıldız */}
      <circle cx={80} cy={110} r={34} fill="none" stroke={COL.text} strokeWidth={2} />
      <g stroke={COL.text} strokeWidth={2}>
        <line x1={80} y1={110} x2={80} y2={88} />
        <line x1={80} y1={110} x2={61} y2={121} />
        <line x1={80} y1={110} x2={99} y2={121} />
      </g>
      {/* yıldız noktasından aşağı */}
      {sys !== "it" ? (
        <>
          <line x1={80} y1={144} x2={80} y2={185} stroke={COL.pe} strokeWidth={2} />
          <Earth x={80} y={185} label="Betriebserdung (işletme topr.)" />
        </>
      ) : (
        <>
          <line x1={80} y1={144} x2={80} y2={162} stroke={COL.mut} strokeWidth={2} strokeDasharray="3 3" />
          <rect x={68} y={162} width={24} height={16} fill="none" stroke={COL.mut} strokeWidth={1.5} />
          <text x={80} y={174} textAnchor="middle" fill={COL.mut} fontSize={10}>
            Z
          </text>
          <text x={80} y={196} textAnchor="middle" fill={COL.mut} fontSize={9}>
            izole / yüksek empedans
          </text>
        </>
      )}

      {/* ── Dış hatlar ── */}
      <line x1={X.trafoEnd} y1={LY.l1} x2={X.dev} y2={LY.l1} stroke={COL.l1} strokeWidth={2.5} />
      <line x1={X.trafoEnd} y1={LY.l2} x2={X.dev} y2={LY.l2} stroke={COL.l2} strokeWidth={2.5} />
      <line x1={X.trafoEnd} y1={LY.l3} x2={X.dev} y2={LY.l3} stroke={COL.l3} strokeWidth={2.5} />
      <Label x={X.trafoEnd + 8} y={LY.l1 - 6} c={COL.l1} t="L1" />
      <Label x={X.trafoEnd + 38} y={LY.l1 - 6} c={COL.l2} t="L2" />
      <Label x={X.trafoEnd + 68} y={LY.l1 - 6} c={COL.l3} t="L3" />

      {/* N / PE / PEN — sisteme göre */}
      {penToHak && (
        <>
          <GY pen d={`M ${X.trafoEnd} ${LY.n} L ${penToDevice ? X.dev : X.hak} ${LY.n}`} />
          <Label x={X.trafoEnd + 8} y={LY.n - 7} c={COL.pe} t="PEN" />
        </>
      )}
      {nFromTrafo && (
        <>
          <line x1={X.trafoEnd} y1={LY.n} x2={X.dev} y2={LY.n} stroke={COL.n} strokeWidth={2.5} />
          <Label x={X.trafoEnd + 8} y={LY.n - 7} c={COL.n} t="N" />
        </>
      )}
      {peFromTrafo && (
        <>
          <GY d={`M ${X.trafoEnd} ${LY.pe} L ${X.dev} ${LY.pe}`} />
          <Label x={X.trafoEnd + 8} y={LY.pe - 7} c={COL.pe} t="PE" />
        </>
      )}
      {split && (
        <>
          {/* HAK'tan sonra N + PE ayrı */}
          <line x1={X.hak} y1={LY.n} x2={X.dev} y2={LY.n} stroke={COL.n} strokeWidth={2.5} />
          <GY d={`M ${X.hak} ${LY.n} L ${X.hak + 26} ${LY.pe} L ${X.dev} ${LY.pe}`} />
          <circle cx={X.hak} cy={LY.n} r={4.5} fill={COL.hot} />
          <Label x={X.hak + 34} y={LY.n - 7} c={COL.n} t="N" />
          <Label x={X.hak + 60} y={LY.pe - 7} c={COL.pe} t="PE" />
          <text x={X.hak} y={LY.n + 30} textAnchor="middle" fill={COL.hot} fontSize={10} fontWeight={600}>
            ⚡ PEN ayrım noktası
          </text>
          <text x={X.hak} y={LY.n + 42} textAnchor="middle" fill={COL.mut} fontSize={8.5}>
            bir kez ayrıldı mı bir daha birleşmez!
          </text>
        </>
      )}

      {/* ── Bina ── */}
      <rect x={X.hak - 60} y={20} width={W - (X.hak - 60) - 10} height={266} rx={10} fill="none" stroke={COL.box} strokeDasharray="5 4" opacity={0.5} />
      <text x={X.hak - 60 + (W - (X.hak - 60) - 10) / 2} y={38} textAnchor="middle" fill={COL.text} fontSize={11} fontWeight={600}>
        Bina (Gebäude)
      </text>
      {/* HAK kutusu */}
      <rect x={X.hak - 22} y={200} width={44} height={30} rx={4} fill="#131c2a" stroke={COL.box} strokeWidth={1.5} />
      <text x={X.hak} y={219} textAnchor="middle" fill={COL.text} fontSize={9} fontWeight={600}>
        HAK
      </text>
      <text x={X.hak} y={244} textAnchor="middle" fill={COL.mut} fontSize={8.5}>
        Hausanschlusskasten
      </text>
      <line x1={X.hak} y1={LY.n} x2={X.hak} y2={200} stroke={COL.box} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />

      {/* ── Cihaz (Verbraucher) ── */}
      <rect x={X.dev} y={40} width={110} height={130} rx={8} fill="#131c2a" stroke={COL.text} strokeWidth={1.5} />
      <circle cx={X.dev + 55} cy={84} r={22} fill="none" stroke={COL.text} strokeWidth={2} />
      <text x={X.dev + 55} y={89} textAnchor="middle" fill={COL.text} fontSize={13} fontWeight={600}>
        M
      </text>
      <text x={X.dev + 55} y={126} textAnchor="middle" fill={COL.mut} fontSize={9}>
        Verbraucher / gövde
      </text>
      <text x={X.dev + 55} y={138} textAnchor="middle" fill={COL.mut} fontSize={9}>
        (metal gövdeli cihaz)
      </text>

      {/* gövde koruma bağlantısı */}
      {penToDevice && (
        <>
          <GY pen d={`M ${X.dev} ${LY.n} L ${X.dev + 20} ${LY.n} L ${X.dev + 20} ${170}`} />
          <text x={X.dev + 40} y={186} fill={COL.mut} fontSize={8.5}>
            gövde PEN'e bağlı
          </text>
        </>
      )}
      {(sys === "tn-s" || split) && (
        <GY d={`M ${X.dev} ${LY.pe} L ${X.dev + 20} ${LY.pe} L ${X.dev + 20} ${170}`} />
      )}
      {localEarth && (
        <>
          <GY d={`M ${X.dev + 20} ${170} L ${X.dev + 20} ${226}`} />
          <Earth x={X.dev + 20} y={226} label={sys === "tt" ? "Anlagenerder (bina toprağı)" : "koruma topraklaması"} />
        </>
      )}
      {sys === "it" && (
        <>
          <rect x={X.hak - 30} y={60} width={60} height={26} rx={5} fill="none" stroke={COL.hot} strokeWidth={1.5} />
          <text x={X.hak} y={77} textAnchor="middle" fill={COL.hot} fontSize={9}>
            ISO-Wächter
          </text>
          <text x={X.hak} y={100} textAnchor="middle" fill={COL.mut} fontSize={8.5}>
            izolasyon bekçisi: ilk hatada alarm
          </text>
        </>
      )}

      {/* alt bilgi: sistemin tek cümlelik özeti */}
      <text x={16} y={H - 6} fill={COL.mut} fontSize={10}>
        {sys === "tn-c" && "TN-C: PE + N tek iletkende (PEN) — trafodan cihaza kadar. Eski usul; PEN koparsa gövdeler gerilim altında kalır."}
        {sys === "tn-s" && "TN-S: N ve PE trafodan itibaren ayrı yürür. Beş telli modern sistem — temiz, güvenli, EMC dostu."}
        {sys === "tn-c-s" && "TN-C-S: Şebekede PEN, binada ayrım — HAK'taki sarı nokta ayrım noktası. Almanya'daki standart ev bağlantısı."}
        {sys === "tt" && "TT: Trafo kendi toprağına, bina KENDİ toprağına. Metalik PE bağlantısı yok — RCD burada hayat sigortası."}
        {sys === "it" && "IT: Şebeke toprağa bağlı değil. İlk hata devreyi durdurmaz, izolasyon bekçisi alarm verir — ameliyathane felsefesi."}
      </text>
    </svg>
  );
}
