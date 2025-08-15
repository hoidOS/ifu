import { useState, useEffect } from "react";
import Head from 'next/head'
import Image from 'next/image'
import SVG from '../assets/svg'
import * as util from '../components/utilStop'
import html2canvas from 'html2canvas'

interface InputInterface {
  vA: number,
  vE: number,
  tR: number,
  tS: number,
  am: number,
}

function Stop() {

  const data: InputInterface = {
    vA: 50,
    vE: 0,
    tR: 0.8,
    tS: 0.2,
    am: 7.5,
  }

  const [input, setInput] = useState<InputInterface>(data)

  // Load saved values from sessionStorage on component mount
  useEffect(() => {
    const savedVA = sessionStorage.getItem('stop_vA');
    const savedVE = sessionStorage.getItem('stop_vE');
    const savedTR = sessionStorage.getItem('stop_tR');
    const savedTS = sessionStorage.getItem('stop_tS');
    const savedAM = sessionStorage.getItem('stop_am');
    
    const updatedInput = { ...data };
    if (savedVA && !isNaN(parseFloat(savedVA))) updatedInput.vA = parseFloat(savedVA);
    if (savedVE && !isNaN(parseFloat(savedVE))) updatedInput.vE = parseFloat(savedVE);
    if (savedTR && !isNaN(parseFloat(savedTR))) updatedInput.tR = parseFloat(savedTR);
    if (savedTS && !isNaN(parseFloat(savedTS))) updatedInput.tS = parseFloat(savedTS);
    if (savedAM && !isNaN(parseFloat(savedAM))) updatedInput.am = parseFloat(savedAM);
    
    setInput(updatedInput);
  }, []);

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
        link.download = 'ergebnisse-anhaltevorgang.png';
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
              // Check for clipboard support more thoroughly
              if (navigator.clipboard && navigator.clipboard.write && window.ClipboardItem) {
                // Additional check for secure context (HTTPS requirement)
                if (window.isSecureContext || location.protocol === 'https:' || 
                    location.hostname === 'localhost' || location.hostname === '127.0.0.1' ||
                    location.hostname.startsWith('192.168.') || location.hostname.endsWith('.local')) {
                  
                  // Test clipboard permissions first
                  const permission = await navigator.permissions.query({ name: 'clipboard-write' as PermissionName });
                  if (permission.state === 'denied') {
                    throw new Error('Clipboard permission denied');
                  }
                  
                  await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                  ]);
                  return; // Success, exit early
                } else {
                  throw new Error('Clipboard requires secure context (HTTPS)');
                }
              } else {
                throw new Error('Clipboard API not supported');
              }
            } catch (error) {
              console.error('Clipboard copy failed:', error);
              // Fallback: download the image instead
              const dataUrl = canvas.toDataURL('image/png');
              const link = document.createElement('a');
              link.download = 'ergebnisse-anhaltevorgang.png';
              link.href = dataUrl;
              link.click();
              
              // More specific error message
              const errorMessage = error instanceof Error ? error.message : String(error);
              if (errorMessage.includes('secure context')) {
                alert('Clipboard requires HTTPS. Image has been downloaded instead.');
              } else if (errorMessage.includes('permission denied')) {
                alert('Clipboard permission denied. Image has been downloaded instead.\n\nTip: Allow clipboard access in browser settings or use the Download button.');
              } else if (errorMessage.includes('not supported')) {
                alert('Clipboard not supported on this browser/OS. Image has been downloaded instead.\n\nTip: Use the Download button for reliable saving.');
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

  const reaction: string = util.getReaction(input.vA, input.tR)
  const breakDelay: string = util.getBreakDelay(input.vA, input.tS, input.am)
  const fullSend: string = util.getFullSend(input.vA, input.am, input.tS)
  const breakDistance: string = util.getBreakDistance(input.vA, input.tS, input.vE, input.am)
  const breakDuration: string = util.getBreakDuration(input.vA, input.tS, input.am, input.vE)
  const fullDistance: string = util.getFullDistance(input.vA, input.vE, input.tR, input.tS, input.am)
  const fullTime: string = util.getFullTime(input.vA, input.vE, input.tR, input.tS, input.am)

  return (
    <div>

      <Head>
        <title>PPCAVS | Anhaltevorgang</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width" />
      </Head>

      <div className="grid gap-6 mx-auto max-w-screen-2xl px-4 py-6 md:grid-cols-2">

        <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white no-print">
          <div className="bg-[#0059a9] text-white px-4 py-2 card-header">
            <h2 className="text-base font-semibold">Anhaltevorgang</h2>
          </div>
          <div className="p-4">
          <table className="w-full text-sm border border-[#0059a9] rounded-lg overflow-hidden shadow-md shadow-blue-200/50 border-b-2 border-r-2">
            <thead>
              <tr className="border-b-2 border-[#0059a9]">
                <th className="text-[#0059a9] font-semibold text-left py-3 px-2">Art</th>
                <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Var</th>
                <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Eingabe</th>
                <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Einheit</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Anfangsgeschwindigkeit</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.vA} alt="vA" className="absolute z-0"></Image></td>
                <td className="py-2 px-2 text-center">
                  <input 
                    type="number" 
                    placeholder="v in km/h" 
                    value={isNaN(input.vA) ? '' : input.vA} 
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      setInput({ ...input, vA: value });
                      if (!isNaN(value)) {
                        sessionStorage.setItem('stop_vA', value.toString());
                      } else {
                        sessionStorage.removeItem('stop_vA');
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                  />
                </td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.kmh} alt="kmh" className="absolute z-0"></Image></td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Endgeschwindigkeit</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.vE} alt="vE" className="absolute z-0"></Image></td>
                <td className="py-2 px-2 text-center">
                  <input 
                    type="number" 
                    placeholder="v in km/h" 
                    value={isNaN(input.vE) ? '' : input.vE} 
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      setInput({ ...input, vE: value });
                      if (!isNaN(value)) {
                        sessionStorage.setItem('stop_vE', value.toString());
                      } else {
                        sessionStorage.removeItem('stop_vE');
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                  />
                </td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.kmh} alt="kmh" className="absolute z-0"></Image></td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Reaktionsdauer</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.tR} alt="tR" className="absolute z-0"></Image></td>
                <td className="py-2 px-2 text-center">
                  <input 
                    type="number" 
                    placeholder="s in Sekunden" 
                    value={isNaN(input.tR) ? '' : input.tR} 
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      setInput({ ...input, tR: value });
                      if (!isNaN(value)) {
                        sessionStorage.setItem('stop_tR', value.toString());
                      } else {
                        sessionStorage.removeItem('stop_tR');
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                  />
                </td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.s} alt="s" className="absolute z-0"></Image></td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Bremsschwelldauer</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.tS} alt="tS" className="absolute z-0"></Image></td>
                <td className="py-2 px-2 text-center">
                  <input 
                    type="number" 
                    placeholder="s in Sekunden" 
                    value={isNaN(input.tS) ? '' : input.tS} 
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      setInput({ ...input, tS: value });
                      if (!isNaN(value)) {
                        sessionStorage.setItem('stop_tS', value.toString());
                      } else {
                        sessionStorage.removeItem('stop_tS');
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                  />
                </td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.s} alt="s" className="absolute z-0"></Image></td>
              </tr>
              <tr className="hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Mittlere Verzögerung</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.am} alt="am" className="absolute z-0"></Image></td>
                <td className="py-2 px-2 text-center">
                  <input 
                    type="number" 
                    placeholder="a in m/s²" 
                    value={isNaN(input.am) ? '' : input.am} 
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      setInput({ ...input, am: value });
                      if (!isNaN(value)) {
                        sessionStorage.setItem('stop_am', value.toString());
                      } else {
                        sessionStorage.removeItem('stop_am');
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                  />
                </td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.ms2} alt="ms2" className="absolute z-0"></Image></td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>

        <div id="results-print" className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
          <div className="bg-[#0059a9] text-white px-4 py-2 card-header flex justify-between items-center">
            <h2 className="text-base font-semibold">Ergebnisse</h2>
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
                <th className="text-[#0059a9] font-semibold text-left py-3 px-2">Art</th>
                <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Var</th>
                <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Eingabe</th>
                <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Bemerkungen</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Anfangsgeschwindigkeit</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.vA} alt="vA" className="absolute z-0"></Image></td>
                <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{input.vA.toString().replace(".", ",")} km/h</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.vAvE} alt="vAvE" className="absolute z-0"></Image></td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Endgeschwindigkeit</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.vE} alt="vE" className="absolute z-0"></Image></td>
                <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{input.vE.toString().replace(".", ",")} km/h</td>
                <td className="py-2 px-2 text-center text-sm text-gray-600">0 für Bremsung bis zum Stillstand</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Reaktionsdauer</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.tR} alt="tR" className="absolute z-0"></Image></td>
                <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{input.tR.toString().replace(".", ",")} s</td>
                <td className="py-2 px-2 text-center text-sm text-gray-600">Reaktionspunkt bis Bremspunkt</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Bremsschwelldauer</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.tS} alt="tS" className="absolute z-0"></Image></td>
                <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{input.tS.toString().replace(".", ",")} s</td>
                <td className="py-2 px-2 text-center text-sm text-gray-600">Fahrzeugabhängig</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Mittlere Verzögerung</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.am} alt="am" className="absolute z-0"></Image></td>
                <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{input.am.toString().replace(".", ",")} m/s²</td>
                <td className="py-2 px-2 text-center text-sm text-gray-600">Abhängig von der Reibpaarung</td>
              </tr>
              <tr className="bg-blue-50 border-y-2 border-[#0059a9]">
                <th className="text-[#0059a9] font-semibold text-left py-3 px-2">Art</th>
                <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Var</th>
                <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Ausgabe</th>
                <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Formel</th>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Reaktionsstrecke</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.sR} alt="sR" className="absolute z-0"></Image></td>
                <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{reaction}</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.sRF} alt="sRF" className="absolute z-0"></Image></td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Schwellstrecke</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.sS} alt="sS" className="absolute z-0"></Image></td>
                <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{breakDelay}</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.sSF} alt="sSF" className="absolute z-0"></Image></td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Geschw. Vollverzögerung</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.vV} alt="vV" className="absolute z-0"></Image></td>
                <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{fullSend}</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.vVF} alt="vVF" className="absolute z-0"></Image></td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Bremsstrecke</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.sB} alt="sB" className="absolute z-0"></Image></td>
                <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{breakDistance}</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.sBF} alt="sBF" className="absolute z-0"></Image></td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Bremsdauer</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.tB} alt="tB" className="absolute z-0"></Image></td>
                <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{breakDuration}</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.tBF} alt="tBF" className="absolute z-0"></Image></td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Gesamtstrecke von <Image unoptimized src={SVG.vA} alt="vA" className="absolute z-0"></Image> bis <Image unoptimized src={SVG.vE} alt="vE" className="absolute z-0"></Image></td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.sges} alt="sges" className="absolute z-0"></Image></td>
                <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{fullDistance}</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.sgesF} alt="sgesF" className="absolute z-0"></Image></td>
              </tr>
              <tr className="hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Gesamtdauer von <Image unoptimized src={SVG.vA} alt="vA" className="absolute z-0"></Image> bis <Image unoptimized src={SVG.vE} alt="vE" className="absolute z-0"></Image></td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.tges} alt="tges" className="absolute z-0"></Image></td>
                <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{fullTime}</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.tgesF} alt="tgesF" className="absolute z-0"></Image></td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Stop;
