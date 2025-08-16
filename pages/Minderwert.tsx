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
  ak: number; // Alterskorrektur (Age correction)
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
  ak: 0.2,
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
  fv: "Faktor Vorschaden (FV)\n\nFaktor zwischen 0.2 und 1.0 für vorherige Schäden:\n• 0.2: Erhebliche Vorschäden\n• 0.4: Hohe Vorschäden\n• 0.6: Mittlere Vorschäden\n• 0.8: Geringe Vorschäden\n• 1.0: Keine Vorschäden"
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
    if (savedMFM.ak && !isNaN(parseFloat(savedMFM.ak))) updatedMFM.ak = parseFloat(savedMFM.ak)
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
          <div className="bg-[#0059a9] text-white px-4 py-2 card-header">
            <h2 className="text-base font-semibold">BVSK</h2>
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
          <div className="bg-[#0059a9] text-white px-4 py-2 card-header">
            <h2 className="text-base font-semibold">MFM</h2>
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
                      <span>Alterskorrektur (AK)</span>
                      <Tooltip content={mfmTooltips.ak}>
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
                      placeholder="0.2"
                      value={isNaN(mfmInput.ak) ? '' : mfmInput.ak} 
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        setMfmInput({ ...mfmInput, ak: value });
                        if (!isNaN(value)) {
                          sessionStorage.setItem('minderwert_mfm_ak', value.toString());
                        } else {
                          sessionStorage.removeItem('minderwert_mfm_ak');
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-gray-600 text-xs">0-0.25</td>
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

        {/* Results */}
        <div id="results-print" className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white md:col-span-2">
          <div className="bg-[#0059a9] text-white px-4 py-2 card-header flex justify-between items-center">
            <h2 className="text-base font-semibold">Minderwert Berechnungen</h2>
            <div className="flex gap-2">
              <button 
                id="clipboard-button"
                onClick={() => handleClipboard('results-print')}
                disabled={isProcessing}
                className="bg-white text-[#0059a9] px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white disabled:opacity-50 disabled:cursor-not-allowed"
                title="In Zwischenablage kopieren"
              >
                {isProcessing ? 'Kopiere...' : 'Kopieren'}
              </button>
              <button 
                id="screenshot-button"
                onClick={() => handleScreenshot('results-print', 'minderwert-berechnung.png')}
                disabled={isProcessing}
                className="bg-transparent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 hover:shadow-sm transition-all duration-200 border border-white disabled:opacity-50 disabled:cursor-not-allowed"
                title="Als PNG herunterladen"
              >
                {isProcessing ? 'Lade...' : 'Download'}
              </button>
            </div>
          </div>
          <div className="p-4">
            <table className="w-full text-sm border border-[#0059a9] rounded-lg overflow-hidden shadow-md shadow-blue-200/50 border-b-2 border-r-2">
              <thead>
                <tr className="border-b-2 border-[#0059a9]">
                  <th className="text-[#0059a9] font-semibold text-left py-3 px-2">Modell</th>
                  <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Formel</th>
                  <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Ergebnis</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">BVSK</td>
                  <td className="py-2 px-2 text-center text-xs text-gray-600">MW = WBW × K-Faktor × (%-Wert + M-Wert) / 100</td>
                  <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{bvskResult.toFixed(2).replace(".", ",")} €</td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">MFM</td>
                  <td className="py-2 px-2 text-center text-xs text-gray-600">MW = [(VW/100) + (VW/NP × RK × SU × AK)] × FM × FV</td>
                  <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{mfmResult.toFixed(2).replace(".", ",")} €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Minderwert
