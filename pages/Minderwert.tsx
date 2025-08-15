import Head from 'next/head'
import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'

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

function Minderwert() {
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

  const [bvskInput, setBvskInput] = useState<BVSKInput>(bvskDefaults)
  const [mfmInput, setMfmInput] = useState<MFMInput>(mfmDefaults)

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

  const handleScreenshot = async () => {
    const buttons = document.querySelectorAll('#screenshot-button, #clipboard-button');
    const tables = document.querySelectorAll('#results-print table');
    const containers = document.querySelectorAll('#results-print .p-4');
    
    buttons.forEach(button => {
      (button as HTMLElement).style.display = 'none';
    });
    
    tables.forEach(table => {
      (table as HTMLElement).style.border = 'none';
      (table as HTMLElement).style.boxShadow = 'none';
    });
    
    containers.forEach(container => {
      (container as HTMLElement).style.backgroundColor = 'transparent';
    });
    
    const element = document.getElementById('results-print');
    if (element) {
      try {
        const canvas = await html2canvas(element, {
          useCORS: true,
          allowTaint: true,
          logging: false,
          foreignObjectRendering: false,
          imageTimeout: 15000,
          removeContainer: true,
          scale: 4,
          width: element.scrollWidth,
          height: element.scrollHeight
        } as any);
        
        const link = document.createElement('a');
        link.download = 'minderwert-berechnung.png';
        link.href = canvas.toDataURL();
        link.click();
      } catch (error) {
        console.error('Screenshot failed:', error);
      }
    }
    
    buttons.forEach(button => {
      (button as HTMLElement).style.display = 'block';
    });
    
    tables.forEach(table => {
      (table as HTMLElement).style.border = '';
      (table as HTMLElement).style.boxShadow = '';
    });
    
    containers.forEach(container => {
      (container as HTMLElement).style.backgroundColor = '';
    });
  };

  const handleClipboard = async () => {
    const buttons = document.querySelectorAll('#screenshot-button, #clipboard-button');
    const tables = document.querySelectorAll('#results-print table');
    const containers = document.querySelectorAll('#results-print .p-4');
    
    buttons.forEach(button => {
      (button as HTMLElement).style.display = 'none';
    });
    
    tables.forEach(table => {
      (table as HTMLElement).style.border = 'none';
      (table as HTMLElement).style.boxShadow = 'none';
    });
    
    containers.forEach(container => {
      (container as HTMLElement).style.backgroundColor = 'transparent';
    });
    
    const element = document.getElementById('results-print');
    if (element) {
      try {
        const canvas = await html2canvas(element, {
          useCORS: true,
          allowTaint: true,
          logging: false,
          foreignObjectRendering: false,
          imageTimeout: 15000,
          removeContainer: true,
          scale: 4,
          width: element.scrollWidth,
          height: element.scrollHeight
        } as any);
        
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              if (navigator.clipboard && navigator.clipboard.write && window.ClipboardItem) {
                if (window.isSecureContext || location.protocol === 'https:' || 
                    location.hostname === 'localhost' || location.hostname === '127.0.0.1' ||
                    location.hostname.startsWith('192.168.') || location.hostname.endsWith('.local')) {
                  
                  const permission = await navigator.permissions.query({ name: 'clipboard-write' as PermissionName });
                  if (permission.state === 'denied') {
                    throw new Error('Clipboard permission denied');
                  }
                  
                  await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                  ]);
                  return;
                } else {
                  throw new Error('Clipboard requires secure context (HTTPS)');
                }
              } else {
                throw new Error('Clipboard API not supported');
              }
            } catch (error) {
              console.error('Clipboard copy failed:', error);
              const dataUrl = canvas.toDataURL('image/png');
              const link = document.createElement('a');
              link.download = 'minderwert-berechnung.png';
              link.href = dataUrl;
              link.click();
              
              const errorMessage = error instanceof Error ? error.message : String(error);
              if (errorMessage.includes('secure context')) {
                alert('Clipboard requires HTTPS. Image has been downloaded instead.');
              } else if (errorMessage.includes('permission denied')) {
                alert('Clipboard permission denied. Image has been downloaded instead.');
              } else if (errorMessage.includes('not supported')) {
                alert('Clipboard not supported on this browser/OS. Image has been downloaded instead.');
              } else {
                alert('Clipboard copy failed. Image has been downloaded instead.');
              }
            }
          }
        });
      } catch (error) {
        console.error('Screenshot failed:', error);
      }
    }
    
    buttons.forEach(button => {
      (button as HTMLElement).style.display = 'block';
    });
    
    tables.forEach(table => {
      (table as HTMLElement).style.border = '';
      (table as HTMLElement).style.boxShadow = '';
    });
    
    containers.forEach(container => {
      (container as HTMLElement).style.backgroundColor = '';
    });
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
          <div className="bg-[#0059a9] text-white px-4 py-2 card-header">
            <h2 className="text-base font-semibold">BVSK Modell</h2>
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
                  <td className="py-2 px-2 font-medium text-gray-700">Wiederbeschaffungswert (WBW)</td>
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
                  <td className="py-2 px-2 font-medium text-gray-700">K-Faktor</td>
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
                  <td className="py-2 px-2 font-medium text-gray-700">%-Wert</td>
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
                  <td className="py-2 px-2 font-medium text-gray-700">M-Wert</td>
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
            <h2 className="text-base font-semibold">MFM Modell</h2>
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
                  <td className="py-2 px-2 font-medium text-gray-700">Veräußerungswert (VW)</td>
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
                  <td className="py-2 px-2 font-medium text-gray-700">Neupreis (NP)</td>
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
                  <td className="py-2 px-2 font-medium text-gray-700">Reparaturkosten (RK)</td>
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
                  <td className="py-2 px-2 font-medium text-gray-700">Schadensumfang (SU)</td>
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
                  <td className="py-2 px-2 font-medium text-gray-700">Alterskorrektur (AK)</td>
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
                  <td className="py-2 px-2 font-medium text-gray-700">Faktor Marktgängigkeit (FM)</td>
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
                  <td className="py-2 px-2 font-medium text-gray-700">Faktor Vorschaden (FV)</td>
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
                onClick={handleClipboard}
                className="bg-white text-[#0059a9] px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white"
                title="In Zwischenablage kopieren"
              >
                Kopieren
              </button>
              <button 
                id="screenshot-button"
                onClick={handleScreenshot}
                className="bg-transparent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 hover:shadow-sm transition-all duration-200 border border-white"
                title="Als PNG herunterladen"
              >
                Download
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
