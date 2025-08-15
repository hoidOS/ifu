import { useState } from "react";
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

  const handleScreenshot = async () => {
    const buttons = document.querySelectorAll('#screenshot-button, #clipboard-button');
    buttons.forEach(button => {
      (button as HTMLElement).style.display = 'none';
    });
    
    const element = document.getElementById('results-print');
    if (element) {
      try {
        const canvas = await html2canvas(element, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          scale: 2
        });
        
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
  };

  const handleClipboard = async () => {
    const buttons = document.querySelectorAll('#screenshot-button, #clipboard-button');
    buttons.forEach(button => {
      (button as HTMLElement).style.display = 'none';
    });
    
    const element = document.getElementById('results-print');
    if (element) {
      try {
        const canvas = await html2canvas(element, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          scale: 2
        });
        
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
              ]);
            } catch (error) {
              console.error('Clipboard copy failed:', error);
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
          <table className="w-full text-sm">
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
                <td className="py-2 px-2 text-center"><Image src={SVG.vA} alt="vA" className="mx-auto h-5 w-auto"></Image></td>
                <td className="py-2 px-2 text-center">
                  <input 
                    type="number" 
                    placeholder="v in km/h" 
                    defaultValue={input.vA || ''} 
                    onChange={(e) => setInput({ ...input, vA: e.target.valueAsNumber })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                  />
                </td>
                <td className="py-2 px-2 text-center"><Image src={SVG.kmh} alt="kmh" className="mx-auto h-5 w-auto"></Image></td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Endgeschwindigkeit</td>
                <td className="py-2 px-2 text-center"><Image src={SVG.vE} alt="vE" className="mx-auto h-5 w-auto"></Image></td>
                <td className="py-2 px-2 text-center">
                  <input 
                    type="number" 
                    placeholder="v in km/h" 
                    value={input.vE} 
                    onChange={(e) => setInput({ ...input, vE: e.target.valueAsNumber })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                  />
                </td>
                <td className="py-2 px-2 text-center"><Image src={SVG.kmh} alt="kmh" className="mx-auto h-5 w-auto"></Image></td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Reaktionsdauer</td>
                <td className="py-2 px-2 text-center"><Image src={SVG.tR} alt="tR" className="mx-auto h-5 w-auto"></Image></td>
                <td className="py-2 px-2 text-center">
                  <input 
                    type="number" 
                    placeholder="s in Sekunden" 
                    value={input.tR} 
                    onChange={(e) => setInput({ ...input, tR: e.target.valueAsNumber })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                  />
                </td>
                <td className="py-2 px-2 text-center"><Image src={SVG.s} alt="s" className="mx-auto h-5 w-auto"></Image></td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Bremsschwelldauer</td>
                <td className="py-2 px-2 text-center"><Image src={SVG.tS} alt="tS" className="mx-auto h-5 w-auto"></Image></td>
                <td className="py-2 px-2 text-center">
                  <input 
                    type="number" 
                    placeholder="s in Sekunden" 
                    value={input.tS} 
                    onChange={(e) => setInput({ ...input, tS: e.target.valueAsNumber })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                  />
                </td>
                <td className="py-2 px-2 text-center"><Image src={SVG.s} alt="s" className="mx-auto h-5 w-auto"></Image></td>
              </tr>
              <tr className="hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Mittlere Verzögerung</td>
                <td className="py-2 px-2 text-center"><Image src={SVG.am} alt="am" className="mx-auto h-5 w-auto"></Image></td>
                <td className="py-2 px-2 text-center">
                  <input 
                    type="number" 
                    placeholder="a in m/s²" 
                    value={input.am} 
                    onChange={(e) => setInput({ ...input, am: e.target.valueAsNumber })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                  />
                </td>
                <td className="py-2 px-2 text-center"><Image src={SVG.ms2} alt="ms2" className="mx-auto h-5 w-auto"></Image></td>
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
          <table className="w-full text-sm">
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
                <td className="py-2 px-2 text-center"><Image src={SVG.vA} alt="vA" className="mx-auto h-5 w-auto"></Image></td>
                <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{input.vA.toString().replace(".", ",")} km/h</td>
                <td className="py-2 px-2 text-center"><Image src={SVG.vAvE} alt="vAvE" className="mx-auto h-5 w-auto"></Image></td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Endgeschwindigkeit</td>
                <td className="py-2 px-2 text-center"><Image src={SVG.vE} alt="vE" className="mx-auto h-5 w-auto"></Image></td>
                <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{input.vE.toString().replace(".", ",")} km/h</td>
                <td className="py-2 px-2 text-center text-sm text-gray-600">0 für Bremsung bis zum Stillstand</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Reaktionsdauer</td>
                <td className="py-2 px-2 text-center"><Image src={SVG.tR} alt="tR" className="mx-auto h-5 w-auto"></Image></td>
                <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{input.tR.toString().replace(".", ",")} s</td>
                <td className="py-2 px-2 text-center text-sm text-gray-600">Reaktionspunkt bis Bremspunkt</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Bremsschwelldauer</td>
                <td className="py-2 px-2 text-center"><Image src={SVG.tS} alt="tS" className="mx-auto h-5 w-auto"></Image></td>
                <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{input.tS.toString().replace(".", ",")} s</td>
                <td className="py-2 px-2 text-center text-sm text-gray-600">Fahrzeugabhängig</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Mittlere Verzögerung</td>
                <td className="py-2 px-2 text-center"><Image src={SVG.am} alt="am" className="mx-auto h-5 w-auto"></Image></td>
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
                <td className="py-2 px-2 text-center"><Image src={SVG.sR} alt="sR" className="mx-auto h-5 w-auto"></Image></td>
                <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{reaction}</td>
                <td className="py-2 px-2 text-center"><Image src={SVG.sRF} alt="sRF" className="mx-auto h-5 w-auto"></Image></td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Schwellstrecke</td>
                <td className="py-2 px-2 text-center"><Image src={SVG.sS} alt="sS" className="mx-auto h-5 w-auto"></Image></td>
                <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{breakDelay}</td>
                <td className="py-2 px-2 text-center"><Image src={SVG.sSF} alt="sSF" className="mx-auto h-5 w-auto"></Image></td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Geschw. Vollverzögerung</td>
                <td className="py-2 px-2 text-center"><Image src={SVG.vV} alt="vV" className="mx-auto h-5 w-auto"></Image></td>
                <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{fullSend}</td>
                <td className="py-2 px-2 text-center"><Image src={SVG.vVF} alt="vVF" className="mx-auto h-5 w-auto"></Image></td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Bremsstrecke</td>
                <td className="py-2 px-2 text-center"><Image src={SVG.sB} alt="sB" className="mx-auto h-5 w-auto"></Image></td>
                <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{breakDistance}</td>
                <td className="py-2 px-2 text-center"><Image src={SVG.sBF} alt="sBF" className="mx-auto h-5 w-auto"></Image></td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Bremsdauer</td>
                <td className="py-2 px-2 text-center"><Image src={SVG.tB} alt="tB" className="mx-auto h-5 w-auto"></Image></td>
                <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{breakDuration}</td>
                <td className="py-2 px-2 text-center"><Image src={SVG.tBF} alt="tBF" className="mx-auto h-5 w-auto"></Image></td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Gesamtstrecke von <Image src={SVG.vA} alt="vA" className="inline h-4 w-auto mx-1"></Image> bis <Image src={SVG.vE} alt="vE" className="inline h-4 w-auto mx-1"></Image></td>
                <td className="py-2 px-2 text-center"><Image src={SVG.sges} alt="sges" className="mx-auto h-5 w-auto"></Image></td>
                <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{fullDistance}</td>
                <td className="py-2 px-2 text-center"><Image src={SVG.sgesF} alt="sgesF" className="mx-auto h-5 w-auto"></Image></td>
              </tr>
              <tr className="hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Gesamtdauer von <Image src={SVG.vA} alt="vA" className="inline h-4 w-auto mx-1"></Image> bis <Image src={SVG.vE} alt="vE" className="inline h-4 w-auto mx-1"></Image></td>
                <td className="py-2 px-2 text-center"><Image src={SVG.tges} alt="tges" className="mx-auto h-5 w-auto"></Image></td>
                <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{fullTime}</td>
                <td className="py-2 px-2 text-center"><Image src={SVG.tgesF} alt="tgesF" className="mx-auto h-5 w-auto"></Image></td>
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
