import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect, Fragment } from 'react'
import SVG from '../assets/svg'
import { roundMinderwert } from '../components/utilMinderwert'
import { useScreenshot } from '../hooks/useScreenshot'

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsVisible(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.right + 10,
      y: rect.top - 10
    });
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className="fixed z-[9999] w-80 p-3 text-sm text-white bg-gray-800 rounded-lg shadow-lg pointer-events-none"
             style={{
               left: `${position.x}px`,
               top: `${position.y}px`,
               maxWidth: 'calc(100vw - 20px)',
               transform: position.x > window.innerWidth - 320 ? 'translateX(-100%)' : 'none'
             }}>
          <div className="whitespace-pre-line">{content}</div>
        </div>
      )}
    </div>
  );
}

interface BVSKInput {
  wbw: number; // Wiederbeschaffungswert
  kFaktor: number; // K-Faktor
  prozentWert: number; // %-Wert
  mWert: number; // M-Wert
}

interface MFMInput {
  vw: number; // Veräußerungswert (Sale value)
  np: number; // Neupreis (New price)
  rk: number; // Reparaturkosten
  su: number; // Schadensumfang
  ageMonths: number; // Vehicle age in months
  startDate: string; // Registration/start date (ISO)
  endDate: string; // Reference/end date (ISO)
  ak: number; // Alterskorrektur (Age correction) - calculated
  fm: number; // Faktor Marktgängigkeit
  fv: number; // Faktor Vorschaden (Prior damage factor)
}

const bvskDefaults: BVSKInput = {
  wbw: 0,
  kFaktor: 1.0,
  prozentWert: 0,
  mWert: 0
}

const mfmDefaults: MFMInput = {
  vw: 0,
  np: 0,
  rk: 0,
  su: 0.4,
  ageMonths: 0,
  startDate: '',
  endDate: '',
  ak: 0.25, // Will be calculated based on ageMonths
  fm: 1.0,
  fv: 1.0
}

const NBSP = '\u00a0'
const MINUS = '\u2212'

// German number format with a typographic minus sign.
const formatDecimal = (value: number, digits: number): string =>
  new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value).replace('-', MINUS)

// The no-break space keeps the unit on the same line as the number.
const formatEuro = (value: number): string => `${formatDecimal(value, 2)}${NBSP}€`

const formatPercent = (value: number, digits = 1): string => `${formatDecimal(value, digits)}${NBSP}%`

const formatOrDash = (value: number, format: (value: number) => string): string =>
  Number.isFinite(value) ? format(value) : '–'

const BVSK_COLOR = '#0059a9'
const MFM_COLOR = '#c2410c'

type ValuationSystem = 'bvsk' | 'mfm'

// Shared by the comparison bars and the result row so the amounts line up in one column.
const COMPARISON_ROW = 'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 sm:grid-cols-[7rem_8rem_minmax(0,1fr)]'

// Flat system tints; Tailwind opacity modifiers would compile to color-mix(), which html2canvas cannot draw.
const SYSTEM_STYLES: Record<ValuationSystem, { box: string; title: string; divider: string; rule: string; value: string }> = {
  bvsk: {
    box: 'border-primary-200 bg-primary-50',
    title: 'text-primary-700',
    divider: 'divide-primary-100',
    rule: 'border-primary-700',
    value: 'text-primary-700',
  },
  mfm: {
    box: 'border-orange-200 bg-orange-50',
    title: 'text-orange-700',
    divider: 'divide-orange-100',
    rule: 'border-orange-700',
    value: 'text-orange-700',
  },
}

interface BreakdownRow {
  label: string
  value: string
}

function BreakdownBox({
  title,
  system,
  rows,
  result,
}: {
  title: string
  system: ValuationSystem
  rows: BreakdownRow[]
  result: number
}) {
  const style = SYSTEM_STYLES[system]

  return (
    <div className={`rounded-lg border px-4 py-3 ${style.box}`}>
      <h3 className={`font-semibold ${style.title}`}>{title}</h3>
      <dl className={`mt-2 divide-y text-sm ${style.divider}`}>
        {rows.map(row => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 py-1.5">
            <dt className="min-w-0 text-gray-600">{row.label}</dt>
            <dd className="whitespace-nowrap tabular-nums text-gray-900">{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className={`mt-1 flex items-baseline justify-between gap-4 border-t-2 pt-2 font-semibold ${style.rule}`}>
        <span className="text-gray-800">Minderwert</span>
        <span className={`whitespace-nowrap tabular-nums ${style.value}`}>{formatEuro(result)}</span>
      </div>
    </div>
  )
}

const bvskTooltips = {
  wbw: "Wiederbeschaffungswert (WBW)\n\nDer Wiederbeschaffungswert des Fahrzeugs zum Unfallzeitpunkt, inklusive Mehrwertsteuer.\n\nDAT Händlerverkaufswert",
  kFaktor: "K-Faktor (Vorschadenfaktor)\n\nKorrekturfaktor für vorherige Fahrzeugschäden:\n• 0.5-0.8: Reparierte Vorschäden\n• 0.8: Leichte Nutzfahrzeuge\n• 1.0: Keine Vorschäden",
  prozentWert: "%-Wert (Schadensintensität)\n\nProzentsatz zwischen 0% und 8% zur Bewertung der Schadensschwere:\n• 0-0.5%: Klasse 1 (leichte Schäden mit Ersatz von Anbauteilen und Lackierarbeiten, keine Richtarbeiten)\n• 0.5-1.5%: Klasse 2 (wie Klasse 1, zusätzlich Ersatz geschraubter Karosserieteile ohne Richtarbeiten)\n• 1.5-2.5%: Klasse 3 (wie Klasse 2, zusätzlich Richtarbeiten an geschweißten Karosserieteilen)\n• 2.5-3.5%: Klasse 4 (wie Klasse 3, zusätzlich Ersatz geschweißter Karosserieteile und Achsteile)\n• 3.5-4.5%: Klasse 5 (wie Klasse 4, jedoch mit erheblichen Richtarbeiten an geschweißten Karosserieteilen)\n• 4.5-6.0%: Klasse 6 (wie Klasse 5, zusätzlich Richtbankeinsatz mit Richtarbeiten an Rahmen/Bodenblechen sowie Ersatz dieser Bauteile und Achsteile)\n• 6.0-8.0%: Klasse 7 (wie Klasse 6, zusätzlich Ersatz von Rahmen/Bodenblechen und Schäden vorn und hinten)",
  mWert: "M-Wert (Marktgängigkeitsfaktor)\n\nKorrekturfaktor für Fahrzeugmarkteigenschaften:\n• -0.5%: Gute Marktnachfrage\n• 0%: Durchschnittliche Marktnachfrage\n• 1.0%: Schlechte Marktnachfrage\n• 2.0%: Sehr lange Standzeiten, exotische Fahrzeuge"
}

const mfmTooltips = {
  vw: "Veräußerungswert (VW)\n\nDer Verkaufspreis des Fahrzeugs inklusive Mehrwertsteuer.\n\nDAT Händlereinkaufswert",
  np: "Neupreis (NP)\n\nDer ursprüngliche Neuwagenpreis inklusive Mehrwertsteuer.",
  rk: "Reparaturkosten (RK)\n\nGesamte Reparaturkosten inklusive Mehrwertsteuer.",
  su: "Schadensumfang (SU)\n\nFaktor zwischen 0.2 und 1.0 für das Ausmaß der Beschädigung:\n• 0.2: Ersatz/Reparatur von anbaubaren Teilen\n• 0.4: Ersatz/Reparatur von \"geschraubten\" Karosserieteilen\n• 0.6: Geringfügige Reparaturen an tragenden Karosserieteilen\n• 0.8: Erhebliche Reparaturen an tragenden Karosserieteilen\n• 1.0: Ersatz/Großreparatur tragender Karosserieteile",
  ak: "Alterskorrektur (AK)\n\nNichtlinearer Faktor basierend auf dem Fahrzeugalter (0-120 Monate), Bereich von 0.25 bis 0. Höhere Werte bedeuten größere Wertminderung.",
  fm: "Faktor Marktgängigkeit (FM)\n\nFaktor zwischen 0.6 und 1.4 für die Marktnachfrage:\n• 0.6: Sehr gut (Nachfrage übersteigt Angebot deutlich)\n• 0.8: Gut (Erhöhte Nachfrage)\n• 1.0: Normal (Ausgeglichenes Angebot und Nachfrage)\n• 1.2: Schlecht (Erhöhtes Angebot)\n• 1.4: Sehr schlecht (Fahrzeug schwer verkäuflich)",
  fv: "Faktor Vorschaden (FV)\n\nFaktor zwischen 0.2 und 1.0 für vorherige Schäden:\n• 0.2: Erhebliche Vorschäden\n• 0.4: Hohe Vorschäden\n• 0.6: Mittlere Vorschäden\n• 0.8: Geringe Vorschäden\n• 1.0: Keine Vorschäden",
  ageMonths: "Fahrzeugalter (Monate)\n\nGeben Sie das Alter des Fahrzeugs in Monaten ein (0-120 Monate).\nDer AK-Faktor wird automatisch berechnet:\n• 0 Monate → AK 0.25\n• 6 Monate → AK 0.2417\n• 12 Monate → AK 0.2236\n• 24 Monate → AK 0.1734\n• 60 Monate → AK 0.0638\n• 96 Monate → AK 0.0535\n• 114 Monate → AK 0.0206\n• 120 Monate → AK 0.00"
}

const akFactorsByMonth: number[] = [
  0.2500,
  0.2495,
  0.2486,
  0.2474,
  0.2458,
  0.2439,
  0.2417,
  0.2393,
  0.2366,
  0.2336,
  0.2305,
  0.2271,
  0.2236,
  0.2199,
  0.2161,
  0.2122,
  0.2081,
  0.2040,
  0.1997,
  0.1954,
  0.1911,
  0.1867,
  0.1823,
  0.1779,
  0.1734,
  0.1690,
  0.1646,
  0.1602,
  0.1558,
  0.1515,
  0.1472,
  0.1430,
  0.1388,
  0.1347,
  0.1307,
  0.1268,
  0.1229,
  0.1192,
  0.1155,
  0.1120,
  0.1085,
  0.1052,
  0.1020,
  0.0989,
  0.0959,
  0.0930,
  0.0902,
  0.0875,
  0.0850,
  0.0826,
  0.0803,
  0.0781,
  0.0761,
  0.0742,
  0.0723,
  0.0706,
  0.0690,
  0.0676,
  0.0662,
  0.0649,
  0.0638,
  0.0627,
  0.0618,
  0.0609,
  0.0601,
  0.0594,
  0.0588,
  0.0583,
  0.0579,
  0.0575,
  0.0572,
  0.0569,
  0.0567,
  0.0566,
  0.0564,
  0.0564,
  0.0563,
  0.0563,
  0.0564,
  0.0564,
  0.0564,
  0.0565,
  0.0565,
  0.0566,
  0.0566,
  0.0566,
  0.0566,
  0.0565,
  0.0564,
  0.0563,
  0.0561,
  0.0558,
  0.0555,
  0.0551,
  0.0547,
  0.0541,
  0.0535,
  0.0528,
  0.0520,
  0.0510,
  0.0500,
  0.0488,
  0.0476,
  0.0461,
  0.0446,
  0.0429,
  0.0411,
  0.0391,
  0.0370,
  0.0347,
  0.0322,
  0.0296,
  0.0268,
  0.0238,
  0.0206,
  0.0173,
  0.0137,
  0.0100,
  0.0061,
  0.0020,
  0.0000
];

const bvskTable = [
  {
    parameter: 'K-Faktor (Vorschadenfaktor)',
    explanation: 'Korrekturfaktor für vorherige Fahrzeugschäden',
    rows: [
      { range: '0,5 – 0,8', description: 'Reparierter Vorschaden vorhanden' },
      { range: '0,8', description: 'Leichte Nutzfahrzeuge' },
      { range: '1,0', description: 'Ohne Vorschäden' }
    ]
  },
  {
    parameter: '%-Wert (Schadenintensität)',
    explanation: 'Klassifizierung des Schadens',
    rows: [
      { range: '0 – 0,5', description: 'Klasse 1: Leichte Schäden mit Ersatz von Anbauteilen (Stoßstangen u.ä.) und Lackierarbeiten ohne Richtarbeiten' },
      { range: '0,5 – 1,5', description: 'Klasse 2: Wie Klasse 1, zusätzlich Ersatz geschraubter Karosserieteile ohne Richtarbeiten' },
      { range: '1,5 – 2,5', description: 'Klasse 3: Wie Klasse 2, zusätzlich Richtarbeiten an geschweißten Karosserieteilen' },
      { range: '2,5 – 3,5', description: 'Klasse 4: Wie Klasse 3, zusätzlich Ersatz geschweißter Karosserieteile und Achsteile' },
      { range: '3,5 – 4,5', description: 'Klasse 5: Wie Klasse 4, jedoch mit erheblichen Richtarbeiten an geschweißten Karosserieteilen' },
      { range: '4,5 – 6,0', description: 'Klasse 6: Wie Klasse 5, zusätzlich Richtbankeinsatz mit Richtarbeiten an Rahmen/Bodenblechen sowie Ersatz dieser Bauteile und Achsteile' },
      { range: '6,0 – 8,0', description: 'Klasse 7: Wie Klasse 6, zusätzlich Ersatz von Rahmen/Bodenblechen und Schäden vorn und hinten' }
    ]
  },
  {
    parameter: 'M-Wert (Marktgängigkeitsfaktor)',
    explanation: 'Korrekturfaktor Marktgängigkeit',
    rows: [
      { range: '−0,5', description: 'Gute Marktnachfrage' },
      { range: '0', description: 'Durchschnittliche Marktnachfrage' },
      { range: '1,0', description: 'Schlechte Marktnachfrage' },
      { range: '2,0', description: 'Sehr lange Standzeiten, exotische Fahrzeuge' }
    ]
  }
];

const mfmTable = [
  {
    parameter: 'SU-Faktor (Schadenumfang)',
    explanation: 'Bewertung des Schadensumfangs',
    rows: [
      { range: '0,2', description: 'Erneuerung/Instandsetzung von Anbauteilen (z. B. Stoßfänger)' },
      { range: '0,4', description: 'Erneuerung/Instandsetzung geschraubter Karosserieteile' },
      { range: '0,6', description: 'Geringe Instandsetzungsarbeiten an tragenden oder mittragenden Teilen' },
      { range: '0,8', description: 'Erhebliche Instandsetzungsarbeiten und/oder Erneuerung tragender Teile' },
      { range: '1,0', description: 'Erhebliche Instandsetzung/Erneuerung tragender Teile (Richtbank erforderlich)' }
    ]
  },
  {
    parameter: 'AK-Faktor (Alterskorrektur)',
    explanation: 'Wird automatisiert aus dem Fahrzeugalter abgeleitet',
    rows: []
  },
  {
    parameter: 'FM-Faktor (Marktgängigkeit)',
    explanation: 'Bewertung der Marktposition',
    rows: [
      { range: '0,6', description: 'Sehr gut – Nachfrage übersteigt Angebot deutlich' },
      { range: '0,8', description: 'Gut – erhöhte Nachfrage' },
      { range: '1,0', description: 'Normal – ausgeglichenes Verhältnis' },
      { range: '1,2', description: 'Schlecht – erhöhtes Angebot' },
      { range: '1,4', description: 'Sehr schlecht – Fahrzeug schwer verkäuflich' }
    ]
  },
  {
    parameter: 'FV-Faktor (Vorschaden)',
    explanation: 'Bewertung vorhandener Vorschäden',
    rows: [
      { range: '0,2', description: 'Erhebliche Vorschäden' },
      { range: '0,4', description: 'Hoher Vorschaden' },
      { range: '0,6', description: 'Mittlerer Vorschaden' },
      { range: '0,8', description: 'Geringer Vorschaden' },
      { range: '1,0', description: 'Ohne Vorschaden' }
    ]
  }
];

function calculateVehicleAgeMonths(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  if (end < start) {
    return 0;
  }

  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

  if (end.getDate() < start.getDate()) {
    months -= 1;
  }

  const nonNegativeMonths = Math.max(0, months);
  return Math.min(120, nonNegativeMonths);
}

// Calculate AK factor based on vehicle age in months (0-120 months)
function calculateAKFactor(ageMonths: number): number {
  if (Number.isNaN(ageMonths)) {
    return akFactorsByMonth[0] ?? 0;
  }

  const clampedAge = Math.max(0, Math.min(120, Math.round(ageMonths)));
  return akFactorsByMonth[clampedAge] ?? 0;
}

function Minderwert() {

  const [bvskInput, setBvskInput] = useState<BVSKInput>(bvskDefaults)
  const [mfmInput, setMfmInput] = useState<MFMInput>(mfmDefaults)
  
  const { isProcessing, handleScreenshot, handleClipboard } = useScreenshot();

  // Load saved values from sessionStorage on component mount
  useEffect(() => {
    const savedBVSK = {
      wbw: sessionStorage.getItem('minderwert_bvsk_wbw'),
      kFaktor: sessionStorage.getItem('minderwert_bvsk_kFaktor'),
      prozentWert: sessionStorage.getItem('minderwert_bvsk_prozentWert'),
      mWert: sessionStorage.getItem('minderwert_bvsk_mWert')
    }

    const savedMFM = {
      vw: sessionStorage.getItem('minderwert_mfm_vw'),
      np: sessionStorage.getItem('minderwert_mfm_np'),
      rk: sessionStorage.getItem('minderwert_mfm_rk'),
      su: sessionStorage.getItem('minderwert_mfm_su'),
      ageMonths: sessionStorage.getItem('minderwert_mfm_ageMonths'),
      startDate: sessionStorage.getItem('minderwert_mfm_startDate'),
      endDate: sessionStorage.getItem('minderwert_mfm_endDate'),
      ak: sessionStorage.getItem('minderwert_mfm_ak'),
      fm: sessionStorage.getItem('minderwert_mfm_fm'),
      fv: sessionStorage.getItem('minderwert_mfm_fv')
    }

    const updatedBVSK = { ...bvskDefaults }
    const updatedMFM = { ...mfmDefaults }

    // Update BVSK values
    if (savedBVSK.wbw && !isNaN(parseFloat(savedBVSK.wbw))) updatedBVSK.wbw = parseFloat(savedBVSK.wbw)
    if (savedBVSK.kFaktor && !isNaN(parseFloat(savedBVSK.kFaktor))) updatedBVSK.kFaktor = parseFloat(savedBVSK.kFaktor)
    if (savedBVSK.prozentWert && !isNaN(parseFloat(savedBVSK.prozentWert))) updatedBVSK.prozentWert = parseFloat(savedBVSK.prozentWert)
    if (savedBVSK.mWert && !isNaN(parseFloat(savedBVSK.mWert))) updatedBVSK.mWert = parseFloat(savedBVSK.mWert)

    // Update MFM values
    if (savedMFM.vw && !isNaN(parseFloat(savedMFM.vw))) updatedMFM.vw = parseFloat(savedMFM.vw)
    if (savedMFM.np && !isNaN(parseFloat(savedMFM.np))) updatedMFM.np = parseFloat(savedMFM.np)
    if (savedMFM.rk && !isNaN(parseFloat(savedMFM.rk))) updatedMFM.rk = parseFloat(savedMFM.rk)
    if (savedMFM.su && !isNaN(parseFloat(savedMFM.su))) updatedMFM.su = parseFloat(savedMFM.su)
    if (savedMFM.startDate) updatedMFM.startDate = savedMFM.startDate
    if (savedMFM.endDate) updatedMFM.endDate = savedMFM.endDate

    if (updatedMFM.startDate && updatedMFM.endDate) {
      const derivedAge = calculateVehicleAgeMonths(updatedMFM.startDate, updatedMFM.endDate)
      updatedMFM.ageMonths = derivedAge
      updatedMFM.ak = calculateAKFactor(derivedAge)
    } else if (savedMFM.ageMonths && !isNaN(parseFloat(savedMFM.ageMonths))) {
      updatedMFM.ageMonths = parseFloat(savedMFM.ageMonths)
      updatedMFM.ak = calculateAKFactor(updatedMFM.ageMonths)
    }
    if (savedMFM.fm && !isNaN(parseFloat(savedMFM.fm))) updatedMFM.fm = parseFloat(savedMFM.fm)
    if (savedMFM.fv && !isNaN(parseFloat(savedMFM.fv))) updatedMFM.fv = parseFloat(savedMFM.fv)

    setBvskInput(updatedBVSK)
    setMfmInput(updatedMFM)
  }, [])

  // Calculate BVSK: MW = WBW * K-Faktor * (%-Wert + M-Wert) / 100
  const calculateBVSK = (): number => {
    if (!(bvskInput.wbw > 0)) return 0
    const result = bvskInput.wbw * bvskInput.kFaktor * (bvskInput.prozentWert + bvskInput.mWert) / 100
    return Number.isFinite(result) ? result : 0
  }

  // Calculate MFM: MW = [(VW / 100) + (VW / NP * RK * SU * AK)] * FM * FV
  const calculateMFM = (): number => {
    if (!(mfmInput.vw > 0) || !(mfmInput.np > 0)) return 0
    const part1 = mfmInput.vw / 100
    const part2 = (mfmInput.vw / mfmInput.np) * mfmInput.rk * mfmInput.su * mfmInput.ak
    const result = (part1 + part2) * mfmInput.fm * mfmInput.fv
    return Number.isFinite(result) ? result : 0
  }


  // Reset functions
  const handleResetBVSK = () => {
    setBvskInput(bvskDefaults);
    sessionStorage.removeItem('minderwert_bvsk_wbw');
    sessionStorage.removeItem('minderwert_bvsk_kFaktor');
    sessionStorage.removeItem('minderwert_bvsk_prozentWert');
    sessionStorage.removeItem('minderwert_bvsk_mWert');
  };

  const handleResetMFM = () => {
    setMfmInput(mfmDefaults);
    sessionStorage.removeItem('minderwert_mfm_vw');
    sessionStorage.removeItem('minderwert_mfm_np');
    sessionStorage.removeItem('minderwert_mfm_rk');
    sessionStorage.removeItem('minderwert_mfm_su');
    sessionStorage.removeItem('minderwert_mfm_ageMonths');
    sessionStorage.removeItem('minderwert_mfm_startDate');
    sessionStorage.removeItem('minderwert_mfm_endDate');
    sessionStorage.removeItem('minderwert_mfm_ak');
    sessionStorage.removeItem('minderwert_mfm_fm');
    sessionStorage.removeItem('minderwert_mfm_fv');
  };

  const bvskResult = calculateBVSK()
  const mfmResult = calculateMFM()
  const average = (bvskResult + mfmResult) / 2
  const roundedAverage = roundMinderwert(average)
  const comparisonMax = Math.max(bvskResult, mfmResult)
  const shareOfMax = (value: number): number => comparisonMax > 0 ? (value / comparisonMax) * 100 : 0

  const formatFactor = (value: number): string => formatOrDash(value, factor => formatDecimal(factor, 2))

  const bvskRows: BreakdownRow[] = [
    { label: 'Wiederbeschaffungswert (WBW)', value: formatOrDash(bvskInput.wbw, formatEuro) },
    { label: 'K-Faktor', value: formatFactor(bvskInput.kFaktor) },
    { label: '%-Wert', value: formatOrDash(bvskInput.prozentWert, value => formatPercent(value)) },
    { label: 'M-Wert', value: formatOrDash(bvskInput.mWert, value => formatPercent(value)) },
  ]

  const mfmRows: BreakdownRow[] = [
    { label: 'Veräußerungswert (VW)', value: formatOrDash(mfmInput.vw, formatEuro) },
    { label: 'Neupreis (NP)', value: formatOrDash(mfmInput.np, formatEuro) },
    { label: 'Fahrzeugalter', value: formatOrDash(mfmInput.ageMonths, value => `${formatDecimal(value, 0)}${NBSP}Monate`) },
    { label: 'Alterskorrektur (AK)', value: formatOrDash(mfmInput.ak, value => formatDecimal(value, 4)) },
    { label: 'Reparaturkosten (RK)', value: formatOrDash(mfmInput.rk, formatEuro) },
    { label: 'Schadensumfang (SU)', value: formatFactor(mfmInput.su) },
    { label: 'Marktgängigkeit (FM)', value: formatFactor(mfmInput.fm) },
    { label: 'Vorschaden (FV)', value: formatFactor(mfmInput.fv) },
  ]

  const comparisonBars = [
    { label: 'BVSK', value: bvskResult, color: BVSK_COLOR, text: 'text-primary-700' },
    { label: 'MFM', value: mfmResult, color: MFM_COLOR, text: 'text-orange-700' },
  ]

  return (
    <div>
      <Head>
        <title>PPCAVS | Minderwert</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width" />
      </Head>

      <div className="grid gap-6 mx-auto max-w-screen-2xl px-4 py-6 md:grid-cols-2">

        {/* BVSK Calculator */}
        <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white no-print">
          <div className="calculator-card-header">
            <h2 className="text-lg font-semibold">BVSK</h2>
            <button
              onClick={handleResetBVSK}
              className="calculator-header-button"
              title="Alle Eingaben zurücksetzen"
            >
              Reset
            </button>
          </div>
          <div className="p-4">
            <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="border-b-2 border-primary-700">
                  <th className="text-primary-700 font-semibold text-left py-3 px-2">Parameter</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Eingabe</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Einheit</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>Wiederbeschaffungswert (WBW)</span>
                      <Tooltip content={bvskTooltips.wbw}>
                        <svg className="w-4 h-4 text-gray-400 hover:text-primary-700 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </Tooltip>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input 
                      type="number" 
                      placeholder="0"
                      value={isNaN(bvskInput.wbw) ? '' : bvskInput.wbw} 
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        setBvskInput({ ...bvskInput, wbw: value });
                        if (!isNaN(value)) {
                          sessionStorage.setItem('minderwert_bvsk_wbw', value.toString());
                        } else {
                          sessionStorage.removeItem('minderwert_bvsk_wbw');
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-transparent text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-600 text-xs">€ (inkl. MwSt.)</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>K-Faktor</span>
                      <Tooltip content={bvskTooltips.kFaktor}>
                        <svg className="w-4 h-4 text-gray-400 hover:text-primary-700 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </Tooltip>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input 
                      type="number" 
                      step="0.1"
                      placeholder="1.0"
                      value={isNaN(bvskInput.kFaktor) ? '' : bvskInput.kFaktor} 
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        setBvskInput({ ...bvskInput, kFaktor: value });
                        if (!isNaN(value)) {
                          sessionStorage.setItem('minderwert_bvsk_kFaktor', value.toString());
                        } else {
                          sessionStorage.removeItem('minderwert_bvsk_kFaktor');
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-transparent text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-600">-</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>%-Wert</span>
                      <Tooltip content={bvskTooltips.prozentWert}>
                        <svg className="w-4 h-4 text-gray-400 hover:text-primary-700 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </Tooltip>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input 
                      type="number" 
                      step="0.1"
                      placeholder="0"
                      value={isNaN(bvskInput.prozentWert) ? '' : bvskInput.prozentWert} 
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        setBvskInput({ ...bvskInput, prozentWert: value });
                        if (!isNaN(value)) {
                          sessionStorage.setItem('minderwert_bvsk_prozentWert', value.toString());
                        } else {
                          sessionStorage.removeItem('minderwert_bvsk_prozentWert');
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-transparent text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-600">%</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>M-Wert</span>
                      <Tooltip content={bvskTooltips.mWert}>
                        <svg className="w-4 h-4 text-gray-400 hover:text-primary-700 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </Tooltip>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input 
                      type="number" 
                      step="0.1"
                      placeholder="0"
                      value={isNaN(bvskInput.mWert) ? '' : bvskInput.mWert} 
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        setBvskInput({ ...bvskInput, mWert: value });
                        if (!isNaN(value)) {
                          sessionStorage.setItem('minderwert_bvsk_mWert', value.toString());
                        } else {
                          sessionStorage.removeItem('minderwert_bvsk_mWert');
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-transparent text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-600">%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* MFM Calculator */}
        <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white no-print">
          <div className="mfm-system-card-header">
            <h2 className="text-lg font-semibold">MFM</h2>
            <button
              onClick={handleResetMFM}
              className="mfm-system-header-button"
              title="Alle Eingaben zurücksetzen"
            >
              Reset
            </button>
          </div>
          <div className="p-4">
            <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="border-b-2 border-orange-700">
                  <th className="text-orange-700 font-semibold text-left py-3 px-2">Parameter</th>
                  <th className="text-orange-700 font-semibold text-center py-3 px-2">Eingabe</th>
                  <th className="text-orange-700 font-semibold text-center py-3 px-2">Bereich</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>Veräußerungswert (VW)</span>
                      <Tooltip content={mfmTooltips.vw}>
                        <svg className="w-4 h-4 text-gray-400 hover:text-orange-700 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </Tooltip>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input 
                      type="number" 
                      placeholder="0"
                      value={isNaN(mfmInput.vw) ? '' : mfmInput.vw} 
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        setMfmInput({ ...mfmInput, vw: value });
                        if (!isNaN(value)) {
                          sessionStorage.setItem('minderwert_mfm_vw', value.toString());
                        } else {
                          sessionStorage.removeItem('minderwert_mfm_vw');
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-700 focus:border-transparent text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-600 text-xs">€ (inkl. MwSt.)</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>Neupreis (NP)</span>
                      <Tooltip content={mfmTooltips.np}>
                        <svg className="w-4 h-4 text-gray-400 hover:text-orange-700 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </Tooltip>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input 
                      type="number" 
                      placeholder="0"
                      value={isNaN(mfmInput.np) ? '' : mfmInput.np} 
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        setMfmInput({ ...mfmInput, np: value });
                        if (!isNaN(value)) {
                          sessionStorage.setItem('minderwert_mfm_np', value.toString());
                        } else {
                          sessionStorage.removeItem('minderwert_mfm_np');
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-700 focus:border-transparent text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-600 text-xs">€ (inkl. MwSt.)</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>Reparaturkosten (RK)</span>
                      <Tooltip content={mfmTooltips.rk}>
                        <svg className="w-4 h-4 text-gray-400 hover:text-orange-700 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </Tooltip>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input 
                      type="number" 
                      placeholder="0"
                      value={isNaN(mfmInput.rk) ? '' : mfmInput.rk} 
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        setMfmInput({ ...mfmInput, rk: value });
                        if (!isNaN(value)) {
                          sessionStorage.setItem('minderwert_mfm_rk', value.toString());
                        } else {
                          sessionStorage.removeItem('minderwert_mfm_rk');
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-700 focus:border-transparent text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-600 text-xs">€ (inkl. MwSt.)</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>Schadensumfang (SU)</span>
                      <Tooltip content={mfmTooltips.su}>
                        <svg className="w-4 h-4 text-gray-400 hover:text-orange-700 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </Tooltip>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="0.4"
                      value={isNaN(mfmInput.su) ? '' : mfmInput.su} 
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        setMfmInput({ ...mfmInput, su: value });
                        if (!isNaN(value)) {
                          sessionStorage.setItem('minderwert_mfm_su', value.toString());
                        } else {
                          sessionStorage.removeItem('minderwert_mfm_su');
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-700 focus:border-transparent text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-600 text-xs">0.2-1.0</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <span>Erstzulassung</span>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="date"
                      lang="de-DE"
                      placeholder="TT.MM.JJJJ"
                      value={mfmInput.startDate}
                      onChange={(e) => {
                        const value = e.target.value;
                        const derivedAge = calculateVehicleAgeMonths(value, mfmInput.endDate);
                        const derivedAk = calculateAKFactor(derivedAge);
                        setMfmInput({
                          ...mfmInput,
                          startDate: value,
                          ageMonths: derivedAge,
                          ak: derivedAk
                        });

                        if (value) {
                          sessionStorage.setItem('minderwert_mfm_startDate', value);
                        } else {
                          sessionStorage.removeItem('minderwert_mfm_startDate');
                        }

                        if (value && mfmInput.endDate) {
                          sessionStorage.setItem('minderwert_mfm_ageMonths', derivedAge.toString());
                          sessionStorage.setItem('minderwert_mfm_ak', derivedAk.toString());
                        } else {
                          sessionStorage.removeItem('minderwert_mfm_ageMonths');
                          sessionStorage.removeItem('minderwert_mfm_ak');
                        }
                      }}
                      className="w-full min-w-[170px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-700 focus:border-transparent text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-600 text-xs">TT.MM.JJJJ</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <span>Bewertungsdatum</span>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="date"
                      lang="de-DE"
                      placeholder="TT.MM.JJJJ"
                      value={mfmInput.endDate}
                      onChange={(e) => {
                        const value = e.target.value;
                        const derivedAge = calculateVehicleAgeMonths(mfmInput.startDate, value);
                        const derivedAk = calculateAKFactor(derivedAge);
                        setMfmInput({
                          ...mfmInput,
                          endDate: value,
                          ageMonths: derivedAge,
                          ak: derivedAk
                        });

                        if (value) {
                          sessionStorage.setItem('minderwert_mfm_endDate', value);
                        } else {
                          sessionStorage.removeItem('minderwert_mfm_endDate');
                        }

                        if (mfmInput.startDate && value) {
                          sessionStorage.setItem('minderwert_mfm_ageMonths', derivedAge.toString());
                          sessionStorage.setItem('minderwert_mfm_ak', derivedAk.toString());
                        } else {
                          sessionStorage.removeItem('minderwert_mfm_ageMonths');
                          sessionStorage.removeItem('minderwert_mfm_ak');
                        }
                      }}
                      className="w-full min-w-[170px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-700 focus:border-transparent text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-600 text-xs">TT.MM.JJJJ</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>Fahrzeugalter</span>
                      <Tooltip content={mfmTooltips.ageMonths}>
                        <svg className="w-4 h-4 text-gray-400 hover:text-orange-700 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </Tooltip>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input 
                      type="number" 
                      min="0"
                      max="120"
                      placeholder="0"
                      value={isNaN(mfmInput.ageMonths) ? '' : mfmInput.ageMonths} 
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-center text-gray-700 font-medium"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-600 text-xs">0-120 Monate</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>Alterskorrektur (AK)</span>
                      <Tooltip content="Automatisch berechnet basierend auf dem Fahrzeugalter">
                        <svg className="w-4 h-4 text-gray-400 hover:text-orange-700 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </Tooltip>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input 
                      type="text"
                      value={mfmInput.ak.toFixed(4)}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none text-center text-gray-700 font-medium"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-600 text-xs">Berechnet</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>Faktor Marktgängigkeit (FM)</span>
                      <Tooltip content={mfmTooltips.fm}>
                        <svg className="w-4 h-4 text-gray-400 hover:text-orange-700 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </Tooltip>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="1.0"
                      value={isNaN(mfmInput.fm) ? '' : mfmInput.fm} 
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        setMfmInput({ ...mfmInput, fm: value });
                        if (!isNaN(value)) {
                          sessionStorage.setItem('minderwert_mfm_fm', value.toString());
                        } else {
                          sessionStorage.removeItem('minderwert_mfm_fm');
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-700 focus:border-transparent text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-600 text-xs">0.6-1.4</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>Faktor Vorschaden (FV)</span>
                      <Tooltip content={mfmTooltips.fv}>
                        <svg className="w-4 h-4 text-gray-400 hover:text-orange-700 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </Tooltip>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="1.0"
                      value={isNaN(mfmInput.fv) ? '' : mfmInput.fv} 
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        setMfmInput({ ...mfmInput, fv: value });
                        if (!isNaN(value)) {
                          sessionStorage.setItem('minderwert_mfm_fv', value.toString());
                        } else {
                          sessionStorage.removeItem('minderwert_mfm_fv');
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-700 focus:border-transparent text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-600 text-xs">0.2-1.0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Minderwertberechnung */}
        <div id="results-table" className="calculator-card self-start">
          <div className="calculator-card-header">
            <h2 className="text-lg font-semibold">Minderwertberechnung</h2>
            <div data-screenshot-ignore="true" className="flex gap-2">
              <button
                onClick={() => handleClipboard('results-table')}
                disabled={isProcessing}
                className="calculator-header-button disabled:opacity-50 disabled:cursor-not-allowed"
                title="In Zwischenablage kopieren"
              >
                {isProcessing ? 'Kopiere...' : 'Kopieren'}
              </button>
              <button
                onClick={() => handleScreenshot('results-table', 'minderwert-berechnungen.png')}
                disabled={isProcessing}
                className="calculator-header-button-outline disabled:opacity-50 disabled:cursor-not-allowed"
                title="Als PNG herunterladen"
              >
                {isProcessing ? 'Lade...' : 'Download'}
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="calculator-table min-w-[520px]" style={{ tableLayout: 'fixed' }}>
                <colgroup>
                  <col style={{ width: '16%' }} />
                  <col style={{ width: '62%' }} />
                  <col style={{ width: '22%' }} />
                </colgroup>
                <thead>
                  <tr className="border-b-2 border-primary-700">
                    <th className="border-x-0 text-primary-700 font-semibold py-3 px-3" style={{ textAlign: 'left' }}>Modell</th>
                    <th className="border-x-0 text-primary-700 font-semibold py-3 px-3" style={{ textAlign: 'center' }}>Formel</th>
                    <th className="border-x-0 text-primary-700 font-semibold py-3 px-3" style={{ textAlign: 'right' }}>Ergebnis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-primary-100 bg-primary-50">
                    <td className="border-x-0 py-3 px-3 font-bold text-primary-700">BVSK</td>
                    <td className="border-x-0 py-3 px-3 text-center">
                      <Image unoptimized src={SVG.mwBvskF} alt="MW = WBW · K · (%-Wert + M-Wert) / 100" className="inline-block h-auto w-auto max-w-full" />
                    </td>
                    <td className="border-x-0 py-3 px-3 text-right text-base font-bold tabular-nums whitespace-nowrap text-primary-700">{formatEuro(bvskResult)}</td>
                  </tr>
                  <tr className="bg-orange-50">
                    <td className="border-x-0 py-3 px-3 font-bold text-orange-700">MFM</td>
                    <td className="border-x-0 py-3 px-3 text-center">
                      <Image unoptimized src={SVG.mwMfmF} alt="MW = [VW / 100 + VW / NP · RK · SU · AK] · FM · FV" className="inline-block h-auto w-auto max-w-full" />
                    </td>
                    <td className="border-x-0 py-3 px-3 text-right text-base font-bold tabular-nums whitespace-nowrap text-orange-700">{formatEuro(mfmResult)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 grid items-start gap-4 sm:grid-cols-2">
              <BreakdownBox title="BVSK Berechnung" system="bvsk" rows={bvskRows} result={bvskResult} />
              <BreakdownBox title="MFM Berechnung" system="mfm" rows={mfmRows} result={mfmResult} />
            </div>
          </div>
        </div>

        {/* Minderwertvergleich */}
        <div id="comparison-chart" className="calculator-card self-start">
          <div className="calculator-card-header">
            <h2 className="text-lg font-semibold">Minderwertvergleich</h2>
            <div data-screenshot-ignore="true" className="flex gap-2">
              <button
                onClick={() => handleClipboard('comparison-chart')}
                disabled={isProcessing}
                className="calculator-header-button disabled:opacity-50 disabled:cursor-not-allowed"
                title="In Zwischenablage kopieren"
              >
                {isProcessing ? 'Kopiere...' : 'Kopieren'}
              </button>
              <button
                onClick={() => handleScreenshot('comparison-chart', 'minderwert-vergleich.png')}
                disabled={isProcessing}
                className="calculator-header-button-outline disabled:opacity-50 disabled:cursor-not-allowed"
                title="Als PNG herunterladen"
              >
                {isProcessing ? 'Lade...' : 'Download'}
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className={`rounded-lg border px-4 py-3 ${SYSTEM_STYLES.bvsk.box}`}>
                <p className="font-semibold text-primary-700">BVSK</p>
                <p className="mt-2 text-xl font-bold tabular-nums whitespace-nowrap text-primary-700">{formatEuro(bvskResult)}</p>
              </div>
              <div className={`rounded-lg border px-4 py-3 ${SYSTEM_STYLES.mfm.box}`}>
                <p className="font-semibold text-orange-700">MFM</p>
                <p className="mt-2 text-xl font-bold tabular-nums whitespace-nowrap text-orange-700">{formatEuro(mfmResult)}</p>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 pb-2">
                <h3 className="text-sm font-semibold text-gray-700">Proportionaler Vergleich</h3>
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="inline-block h-3 w-0.5 bg-slate-700" aria-hidden="true" />
                  Mittelwert
                </span>
              </div>
              <div className="mt-3 space-y-3">
                {comparisonBars.map(bar => (
                  <div key={bar.label} className={COMPARISON_ROW}>
                    <span className={`text-sm font-semibold ${bar.text}`}>{bar.label}</span>
                    <span className="text-right text-sm font-semibold tabular-nums whitespace-nowrap text-gray-900">{formatEuro(bar.value)}</span>
                    <div className="relative col-span-2 h-3 rounded-sm bg-slate-100 sm:col-span-1">
                      <div className="h-3 rounded-sm" style={{ width: `${shareOfMax(bar.value)}%`, backgroundColor: bar.color }} />
                      {average > 0 && (
                        <div
                          className="absolute -top-1 h-5 w-0.5 bg-slate-700"
                          style={{ left: `calc(${shareOfMax(average)}% - 1px)` }}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${COMPARISON_ROW} -mx-2 mt-4 border-t-2 border-slate-600 bg-slate-50 px-2 py-3`}>
              <span className="font-semibold text-slate-900">Minderwert</span>
              <span className="justify-self-end border-b-4 border-double border-slate-700 text-lg font-bold tabular-nums whitespace-nowrap text-slate-900">
                {formatEuro(roundedAverage)}
              </span>
              <p className="col-span-2 text-xs tabular-nums text-gray-500 sm:col-span-1">
                {`(${formatEuro(bvskResult)} + ${formatEuro(mfmResult)}) / 2 = ${formatEuro(average)}`}
                <br />
                gerundet auf volle 50 €
              </p>
            </div>
          </div>
        </div>

        <div id="bvsk-system-card" className="rounded-2xl shadow-lg overflow-hidden border border-slate-200 bg-white md:col-span-1">
          <div className="calculator-card-header">
            <h3 className="text-lg font-semibold whitespace-nowrap">BVSK System – Bewertungsmaßstäbe</h3>
            <div data-screenshot-ignore="true" className="screenshot-buttons flex gap-2">
              <button
                onClick={() => handleClipboard('bvsk-system-card')}
                disabled={isProcessing}
                className="calculator-header-button disabled:opacity-50 disabled:cursor-not-allowed"
                title="In Zwischenablage kopieren"
              >
                {isProcessing ? 'Kopiere...' : 'Kopieren'}
              </button>
              <button
                onClick={() => handleScreenshot('bvsk-system-card', 'bvsk-system.png')}
                disabled={isProcessing}
                className="calculator-header-button-outline disabled:opacity-50 disabled:cursor-not-allowed"
                title="Als PNG herunterladen"
              >
                {isProcessing ? 'Lade...' : 'Download'}
              </button>
            </div>
          </div>
          <div className="p-6 overflow-x-auto">
            <table
              id="bvsk-system-table"
              className="w-full text-sm border border-primary-700 rounded-lg overflow-hidden shadow-md shadow-[0_12px_24px_rgba(0,89,169,0.16)] border-b-2 border-r-2"
            >
              <thead>
                <tr className="text-primary-700 border-b border-primary-200" style={{ backgroundColor: "#eef6fd" }}>
                  <th className="text-left py-3 px-3 font-semibold">Parameter</th>
                  <th className="text-center py-3 px-3 font-semibold">Wertebereich</th>
                  <th className="text-left py-3 px-3 font-semibold">Beschreibung</th>
                </tr>
              </thead>
              <tbody>
                {bvskTable.map(section => (
                  <Fragment key={section.parameter}>
                    <tr className="border-t border-primary-200" style={{ backgroundColor: "#eef6fd" }}>
                      <td className="py-3 px-3 align-top font-semibold text-gray-800" style={{ backgroundColor: "#d9eafb" }}>
                        {section.parameter}
                      </td>
                      <td className="py-3 px-3 text-xs text-gray-600 italic" colSpan={2} style={{ backgroundColor: "#eef6fd" }}>
                        {section.explanation}
                      </td>
                    </tr>
                    {section.rows.length === 0 ? (
                      <tr className="border-t border-slate-200">
                        <td className="py-3 px-3 text-gray-500 italic" colSpan={3}>
                          Keine festen Stufen hinterlegt.
                        </td>
                      </tr>
                    ) : (
                      section.rows.map((row, index) => (
                        <tr key={`${section.parameter}-${row.range}-${index}`} className="border-t border-slate-200">
                          <td className="py-3 px-3" aria-hidden="true" style={{ backgroundColor: "#f8fbfe" }}></td>
                          <td className="py-3 px-3 font-medium text-gray-700 text-center">{row.range}</td>
                          <td className="py-3 px-3 text-gray-600">{row.description}</td>
                        </tr>
                      ))
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div id="mfm-system-card" className="rounded-2xl shadow-lg overflow-hidden border border-slate-200 bg-white md:col-span-1">
          <div className="mfm-system-card-header">
            <h3 className="text-lg font-semibold whitespace-nowrap">MFM System – Bewertungsmaßstäbe</h3>
            <div data-screenshot-ignore="true" className="screenshot-buttons flex gap-2">
              <button
                onClick={() => handleClipboard('mfm-system-card')}
                disabled={isProcessing}
                className="mfm-system-header-button disabled:opacity-50 disabled:cursor-not-allowed"
                title="In Zwischenablage kopieren"
              >
                {isProcessing ? 'Kopiere...' : 'Kopieren'}
              </button>
              <button
                onClick={() => handleScreenshot('mfm-system-card', 'mfm-system.png')}
                disabled={isProcessing}
                className="mfm-system-header-button-outline disabled:opacity-50 disabled:cursor-not-allowed"
                title="Als PNG herunterladen"
              >
                {isProcessing ? 'Lade...' : 'Download'}
              </button>
            </div>
          </div>
          <div className="p-6 overflow-x-auto">
            <table
              id="mfm-system-table"
              className="w-full text-sm border border-orange-700 rounded-lg overflow-hidden shadow-md shadow-[0_12px_24px_rgba(194,65,12,0.16)] border-b-2 border-r-2"
            >
              <thead>
                <tr className="text-orange-700 border-b border-orange-300" style={{ backgroundColor: "#fff7ed" }}>
                  <th className="text-left py-3 px-3 font-semibold">Parameter</th>
                  <th className="text-center py-3 px-3 font-semibold">Wertebereich</th>
                  <th className="text-left py-3 px-3 font-semibold">Beschreibung</th>
                </tr>
              </thead>
              <tbody>
                {mfmTable.map(section => (
                  <Fragment key={section.parameter}>
                    <tr className="border-t border-orange-200" style={{ backgroundColor: "#fff7ed" }}>
                      <td className="py-3 px-3 align-top font-semibold text-gray-800" style={{ backgroundColor: "#ffedd5" }}>
                        {section.parameter}
                      </td>
                      <td className="py-3 px-3 text-xs text-gray-600 italic" colSpan={2} style={{ backgroundColor: "#fff7ed" }}>
                        {section.explanation}
                      </td>
                    </tr>
                    {section.rows.length === 0 ? (
                      <tr className="border-t border-slate-200">
                        <td className="py-3 px-3 text-gray-500 italic" colSpan={3}>
                          Automatische Ableitung – keine Skalenwerte.
                        </td>
                      </tr>
                    ) : (
                      section.rows.map((row, index) => (
                        <tr key={`${section.parameter}-${row.range}-${index}`} className="border-t border-slate-200">
                          <td className="py-3 px-3" aria-hidden="true" style={{ backgroundColor: "#fffbf5" }}></td>
                          <td className="py-3 px-3 font-medium text-gray-700 text-center">{row.range}</td>
                          <td className="py-3 px-3 text-gray-600">{row.description}</td>
                        </tr>
                      ))
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Minderwert
