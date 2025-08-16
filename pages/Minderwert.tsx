import Head from 'next/head'
import { useState, useEffect } from 'react'
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
  ak: 0.25, // Will be calculated based on ageMonths
  fm: 1.0,
  fv: 1.0
}

const bvskTooltips = {
  wbw: "Wiederbeschaffungswert (WBW)\n\nDer Wiederbeschaffungswert des Fahrzeugs zum Unfallzeitpunkt, inklusive Mehrwertsteuer.",
  kFaktor: "K-Faktor (Vorschadenfaktor)\n\nKorrekturfaktor für vorherige Fahrzeugschäden:\n• 0.5-0.8: Reparierte Vorschäden\n• 0.8: Leichte Nutzfahrzeuge\n• 1.0: Keine Vorschäden",
  prozentWert: "%-Wert (Schadensintensität)\n\nProzentsatz zwischen 0% und 8% zur Bewertung der Schadensschwere:\n• 0-0.5%: Klasse 1 (Leichte Schäden)\n• 0.5-1.5%: Klasse 2 (Leichte Schäden)\n• 1.5-2.5%: Klasse 3 (Teileersatz und Richten)\n• 2.5-3.5%: Klasse 4 (Umfangreicher Teileersatz)\n• 3.5-4.5%: Klasse 5 (Erheblicher Teileersatz)\n• 4.5-6.0%: Klasse 6 (Größere Strukturreparaturen)\n• 6.0-8.0%: Klasse 7 (Umfassende Strukturschäden)",
  mWert: "M-Wert (Marktgängigkeitsfaktor)\n\nKorrekturfaktor für Fahrzeugmarkteigenschaften:\n• -0.5%: Gute Marktnachfrage\n• 0%: Durchschnittliche Marktnachfrage\n• 1.0%: Schlechte Marktnachfrage\n• 2.0%: Sehr lange Standzeiten, exotische Fahrzeuge"
}

const mfmTooltips = {
  vw: "Veräußerungswert (VW)\n\nDer Verkaufspreis des Fahrzeugs inklusive Mehrwertsteuer.",
  np: "Neupreis (NP)\n\nDer ursprüngliche Neuwagenpreis inklusive Mehrwertsteuer.",
  rk: "Reparaturkosten (RK)\n\nGesamte Reparaturkosten inklusive Mehrwertsteuer.",
  su: "Schadensumfang (SU)\n\nFaktor zwischen 0.2 und 1.0 für das Ausmaß der Beschädigung:\n• 0.2: Ersatz/Reparatur von anbaubaren Teilen\n• 0.4: Ersatz/Reparatur von \"geschraubten\" Karosserieteilen\n• 0.6: Geringfügige Reparaturen an tragenden Karosserieteilen\n• 0.8: Erhebliche Reparaturen an tragenden Karosserieteilen\n• 1.0: Ersatz/Großreparatur tragender Karosserieteile",
  ak: "Alterskorrektur (AK)\n\nNichtlinearer Faktor basierend auf dem Fahrzeugalter (0-120 Monate), Bereich von 0.25 bis 0. Höhere Werte bedeuten größere Wertminderung.",
  fm: "Faktor Marktgängigkeit (FM)\n\nFaktor zwischen 0.6 und 1.4 für die Marktnachfrage:\n• 0.6: Sehr gut (Nachfrage übersteigt Angebot deutlich)\n• 0.8: Gut (Erhöhte Nachfrage)\n• 1.0: Normal (Ausgeglichenes Angebot und Nachfrage)\n• 1.2: Schlecht (Erhöhtes Angebot)\n• 1.4: Sehr schlecht (Fahrzeug schwer verkäuflich)",
  fv: "Faktor Vorschaden (FV)\n\nFaktor zwischen 0.2 und 1.0 für vorherige Schäden:\n• 0.2: Erhebliche Vorschäden\n• 0.4: Hohe Vorschäden\n• 0.6: Mittlere Vorschäden\n• 0.8: Geringe Vorschäden\n• 1.0: Keine Vorschäden",
  ageMonths: "Fahrzeugalter (Monate)\n\nGeben Sie das Alter des Fahrzeugs in Monaten ein (0-120 Monate).\nDer AK-Faktor wird automatisch berechnet:\n• 0 Monate → AK 0.25\n• 6 Monate → AK 0.2417\n• 12 Monate → AK 0.2236\n• 24 Monate → AK 0.1734\n• 60 Monate → AK 0.0638\n• 96 Monate → AK 0.0535\n• 114 Monate → AK 0.0206\n• 120 Monate → AK 0.00"
}

// Calculate AK factor based on vehicle age in months (0-120 months)
function calculateAKFactor(ageMonths: number): number {
  // Clamp age between 0 and 120 months
  const clampedAge = Math.max(0, Math.min(120, ageMonths));
  
  // Key points from the AK table
  const akTable = [
    { months: 0, ak: 0.25 },
    { months: 6, ak: 0.2417 },
    { months: 12, ak: 0.2236 },
    { months: 24, ak: 0.1734 },
    { months: 60, ak: 0.0638 },
    { months: 96, ak: 0.0535 },
    { months: 114, ak: 0.0206 },
    { months: 120, ak: 0.00 }
  ];

  // Find the appropriate range for interpolation
  for (let i = 0; i < akTable.length - 1; i++) {
    const currentPoint = akTable[i];
    const nextPoint = akTable[i + 1];
    
    if (currentPoint && nextPoint && clampedAge <= nextPoint.months) {
      // Linear interpolation between the two points
      const ratio = (clampedAge - currentPoint.months) / (nextPoint.months - currentPoint.months);
      return currentPoint.ak + ratio * (nextPoint.ak - currentPoint.ak);
    }
  }
  
  // If age is exactly 120 or higher, return 0
  return 0.00;
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
    if (savedMFM.ageMonths && !isNaN(parseFloat(savedMFM.ageMonths))) {
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
    if (bvskInput.wbw <= 0) return 0
    return bvskInput.wbw * bvskInput.kFaktor * (bvskInput.prozentWert + bvskInput.mWert) / 100
  }

  // Calculate MFM: MW = [(VW / 100) + (VW / NP * RK * SU * AK)] * FM * FV
  const calculateMFM = (): number => {
    if (mfmInput.vw <= 0 || mfmInput.np <= 0) return 0
    const part1 = mfmInput.vw / 100
    const part2 = (mfmInput.vw / mfmInput.np) * mfmInput.rk * mfmInput.su * mfmInput.ak
    return (part1 + part2) * mfmInput.fm * mfmInput.fv
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
    sessionStorage.removeItem('minderwert_mfm_ak');
    sessionStorage.removeItem('minderwert_mfm_fm');
    sessionStorage.removeItem('minderwert_mfm_fv');
  };

  const bvskResult = calculateBVSK()
  const mfmResult = calculateMFM()

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
          <div className="bg-[#0059a9] text-white px-4 py-2 card-header flex justify-between items-center">
            <h2 className="text-base font-semibold">BVSK</h2>
            <button
              onClick={handleResetBVSK}
              className="bg-white text-[#0059a9] px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white"
              title="Alle Eingaben zurücksetzen"
            >
              Reset
            </button>
          </div>
          <div className="p-4">
            <table className="w-full text-sm border border-[#0059a9] rounded-lg overflow-hidden shadow-md shadow-blue-200/50 border-b-2 border-r-2">
              <thead>
                <tr className="border-b-2 border-[#0059a9]">
                  <th className="text-[#0059a9] font-semibold text-left py-3 px-2">Parameter</th>
                  <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Eingabe</th>
                  <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Einheit</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>Wiederbeschaffungswert (WBW)</span>
                      <Tooltip content={bvskTooltips.wbw}>
                        <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-600">€</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>K-Faktor</span>
                      <Tooltip content={bvskTooltips.kFaktor}>
                        <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-600">-</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>%-Wert</span>
                      <Tooltip content={bvskTooltips.prozentWert}>
                        <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-600">%</td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>M-Wert</span>
                      <Tooltip content={bvskTooltips.mWert}>
                        <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
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
          <div className="bg-[#0059a9] text-white px-4 py-2 card-header flex justify-between items-center">
            <h2 className="text-base font-semibold">MFM</h2>
            <button
              onClick={handleResetMFM}
              className="bg-white text-[#0059a9] px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white"
              title="Alle Eingaben zurücksetzen"
            >
              Reset
            </button>
          </div>
          <div className="p-4">
            <table className="w-full text-sm border border-[#0059a9] rounded-lg overflow-hidden shadow-md shadow-blue-200/50 border-b-2 border-r-2">
              <thead>
                <tr className="border-b-2 border-[#0059a9]">
                  <th className="text-[#0059a9] font-semibold text-left py-3 px-2">Parameter</th>
                  <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Eingabe</th>
                  <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Bereich</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>Veräußerungswert (VW)</span>
                      <Tooltip content={mfmTooltips.vw}>
                        <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-600 text-xs">€ (inkl. MwSt.)</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>Neupreis (NP)</span>
                      <Tooltip content={mfmTooltips.np}>
                        <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-600 text-xs">€ (inkl. MwSt.)</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>Reparaturkosten (RK)</span>
                      <Tooltip content={mfmTooltips.rk}>
                        <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-600 text-xs">€ (inkl. MwSt.)</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>Schadensumfang (SU)</span>
                      <Tooltip content={mfmTooltips.su}>
                        <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-600 text-xs">0.2-1.0</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>Fahrzeugalter</span>
                      <Tooltip content={mfmTooltips.ageMonths}>
                        <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
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
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        const akValue = isNaN(value) ? 0.25 : calculateAKFactor(value);
                        setMfmInput({ ...mfmInput, ageMonths: value, ak: akValue });
                        if (!isNaN(value)) {
                          sessionStorage.setItem('minderwert_mfm_ageMonths', value.toString());
                        } else {
                          sessionStorage.removeItem('minderwert_mfm_ageMonths');
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-600 text-xs">0-120 Monate</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>Alterskorrektur (AK)</span>
                      <Tooltip content="Automatisch berechnet basierend auf dem Fahrzeugalter">
                        <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
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
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>Faktor Marktgängigkeit (FM)</span>
                      <Tooltip content={mfmTooltips.fm}>
                        <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-600 text-xs">0.6-1.4</td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>Faktor Vorschaden (FV)</span>
                      <Tooltip content={mfmTooltips.fv}>
                        <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-600 text-xs">0.2-1.0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Table */}
        <div id="results-table" className="rounded-2xl shadow-lg overflow-hidden border border-slate-200 bg-white relative">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 opacity-50"></div>
          
          <div className="relative bg-gradient-to-r from-[#0059a9] to-[#003d7a] text-white px-4 py-3 card-header flex justify-between items-center">
            <h2 className="text-lg font-semibold">Minderwert Berechnungen</h2>
            <div className="flex gap-2">
              <button 
                id="clipboard-button"
                onClick={() => handleClipboard('results-table')}
                disabled={isProcessing}
                className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-white/20 hover:shadow-sm transition-all duration-200 border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                title="In Zwischenablage kopieren"
              >
                {isProcessing ? 'Kopiere...' : 'Kopieren'}
              </button>
              <button 
                id="screenshot-button"
                onClick={() => handleScreenshot('results-table', 'minderwert-berechnungen.png')}
                disabled={isProcessing}
                className="bg-white text-[#0059a9] px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white disabled:opacity-50 disabled:cursor-not-allowed"
                title="Als PNG herunterladen"
              >
                {isProcessing ? 'Lade...' : 'Download'}
              </button>
            </div>
          </div>
          
          <div className="relative p-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-[#0059a9] to-[#003d7a] text-white">
                    <th className="font-semibold text-left py-4 px-4">Modell</th>
                    <th className="font-semibold text-center py-4 px-4">Formel</th>
                    <th className="font-semibold text-center py-4 px-4">Ergebnis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-gray-800 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#0059a9]"></div>
                      BVSK
                    </td>
                    <td className="py-4 px-4 text-center text-xs text-gray-600 font-mono">MW = WBW × K-Faktor × (%-Wert + M-Wert) / 100</td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-bold text-lg text-[#0059a9]">{bvskResult.toFixed(2).replace(".", ",")} €</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-orange-50/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-gray-800 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      MFM
                    </td>
                    <td className="py-4 px-4 text-center text-xs text-gray-600 font-mono">MW = [(VW/100) + (VW/NP × RK × SU × AK)] × FM × FV</td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-bold text-lg text-orange-600">{mfmResult.toFixed(2).replace(".", ",")} €</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Visual Comparison */}
        <div id="comparison-chart" className="rounded-2xl shadow-lg overflow-hidden border border-slate-200 bg-white relative">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-50 opacity-50"></div>
          
          <div className="relative bg-gradient-to-r from-[#0059a9] to-[#003d7a] text-white px-4 py-3 card-header flex justify-between items-center">
            <h2 className="text-lg font-semibold">Minderwert Vergleich</h2>
            <div className="flex gap-2">
              <button 
                id="clipboard-button"
                onClick={() => handleClipboard('comparison-chart')}
                disabled={isProcessing}
                className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-white/20 hover:shadow-sm transition-all duration-200 border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                title="In Zwischenablage kopieren"
              >
                {isProcessing ? 'Kopiere...' : 'Kopieren'}
              </button>
              <button 
                id="screenshot-button"
                onClick={() => handleScreenshot('comparison-chart', 'minderwert-vergleich.png')}
                disabled={isProcessing}
                className="bg-white text-[#0059a9] px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white disabled:opacity-50 disabled:cursor-not-allowed"
                title="Als PNG herunterladen"
              >
                {isProcessing ? 'Lade...' : 'Download'}
              </button>
            </div>
          </div>
          
          <div className="relative p-6">
            {/* Enhanced Value Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 shadow-sm">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#0059a9] flex items-center justify-center shadow-lg">
                  <div className="text-xl font-bold text-white">B</div>
                </div>
                <h4 className="font-bold text-gray-700 text-sm mb-2">BVSK</h4>
                <p className="text-xl font-bold text-[#0059a9]">{bvskResult.toFixed(2).replace(".", ",")} €</p>
              </div>
              
              <div className="text-center bg-gradient-to-b from-green-50 to-green-100 rounded-xl p-4 border border-green-200 shadow-sm">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-600 flex items-center justify-center shadow-lg">
                  <div className="text-xl font-bold text-white">Ø</div>
                </div>
                <h4 className="font-bold text-gray-700 text-sm mb-2">Gerundeter Durchschnitt</h4>
                <p className="text-xl font-bold text-green-600">{(Math.round(((bvskResult + mfmResult) / 2) / 50) * 50).toFixed(2).replace(".", ",")} €</p>
              </div>
              
              <div className="text-center bg-gradient-to-b from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200 shadow-sm">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
                  <div className="text-xl font-bold text-white">M</div>
                </div>
                <h4 className="font-bold text-gray-700 text-sm mb-2">MFM</h4>
                <p className="text-xl font-bold text-orange-600">{mfmResult.toFixed(2).replace(".", ",")} €</p>
              </div>
            </div>
            
            {/* Enhanced Progress Bars */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h5 className="text-base font-semibold text-gray-700 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Proportionaler Vergleich
              </h5>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 text-sm font-bold text-gray-700 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#0059a9]"></div>
                    BVSK
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-[#0059a9] to-blue-500 h-full rounded-full transition-all duration-1000 shadow-sm"
                      style={{ width: `${Math.max(10, (bvskResult / Math.max(bvskResult, mfmResult, 1)) * 100)}%` }}
                    >
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-16 text-sm font-bold text-gray-700 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    MFM
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-orange-400 h-full rounded-full transition-all duration-1000 shadow-sm"
                      style={{ width: `${Math.max(10, (mfmResult / Math.max(bvskResult, mfmResult, 1)) * 100)}%` }}
                    >
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-16 text-sm font-bold text-gray-700 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    Ø
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full transition-all duration-1000 shadow-sm"
                      style={{ width: `${Math.max(10, ((Math.round(((bvskResult + mfmResult) / 2) / 50) * 50) / Math.max(bvskResult, mfmResult, 1)) * 100)}%` }}
                    >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Minderwert
