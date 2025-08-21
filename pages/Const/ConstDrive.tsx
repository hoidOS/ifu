
import * as util from '../../components/utilConst'
import { useState, useEffect } from "react";
import Image from 'next/image'
import SVG from '../../assets/svg'
import { useScreenshot } from '../../hooks/useScreenshot'
import StepperInput from '../../components/StepperInput'


function ConstDrive() {
  const [v, setV] = useState<number>(NaN)
  const [s, setS] = useState<number>(NaN)
  const [t, setT] = useState<number>(NaN)
  
  const { isProcessing, handleScreenshot, handleClipboard } = useScreenshot();

  // Load saved values from sessionStorage on component mount
  useEffect(() => {
    const savedV = sessionStorage.getItem('constDrive_v');
    const savedS = sessionStorage.getItem('constDrive_s');
    const savedT = sessionStorage.getItem('constDrive_t');

    if (savedV && !isNaN(parseFloat(savedV))) setV(parseFloat(savedV));
    if (savedS && !isNaN(parseFloat(savedS))) setS(parseFloat(savedS));
    if (savedT && !isNaN(parseFloat(savedT))) setT(parseFloat(savedT));
  }, []);

  // Reset function to clear all input fields and sessionStorage
  const handleReset = () => {
    setV(NaN);
    setS(NaN);
    setT(NaN);

    // Clear from sessionStorage
    sessionStorage.removeItem('constDrive_v');
    sessionStorage.removeItem('constDrive_s');
    sessionStorage.removeItem('constDrive_t');
  };


  const vIsSet = !isNaN(v) && v >= 0
  const sIsSet = !isNaN(s) && s >= 0
  const tIsSet = !isNaN(t) && t >= 0

  const vO = util.getSpeed(s, t)
  const sO = util.getDistance(v, t)
  const tO = util.getTime(s, v)

  return (
    <>
      <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
        <div className="bg-gradient-to-r from-[#0059a9] to-[#003d7a] text-white px-6 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Konstantfahrt</h2>
          <button
            onClick={handleReset}
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
                <th className="text-[#0059a9] font-semibold text-left py-3 px-2">Art</th>
                <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Var</th>
                <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Eingabe</th>
                <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Einheit</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Geschwindigkeit</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.v} alt="v" className="inline-block max-w-full h-auto"></Image></td>
                <td className="py-2 px-2">
                  <StepperInput
                    value={v}
                    onChange={(value) => {
                      setV(value);
                      if (!isNaN(value)) {
                        sessionStorage.setItem('constDrive_v', value.toString());
                      } else {
                        sessionStorage.removeItem('constDrive_v');
                      }
                    }}
                    step={1}
                    min={0}
                    max={300}
                    placeholder="v in km/h"
                    onWheel={e => e.currentTarget.blur()}
                  />
                </td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.kmh} alt="kmh" className="inline-block max-w-full h-auto"></Image></td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Strecke</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.s} alt="s" className="inline-block max-w-full h-auto"></Image></td>
                <td className="py-2 px-2">
                  <StepperInput
                    value={s}
                    onChange={(value) => {
                      setS(value);
                      if (!isNaN(value)) {
                        sessionStorage.setItem('constDrive_s', value.toString());
                      } else {
                        sessionStorage.removeItem('constDrive_s');
                      }
                    }}
                    step={1}
                    min={0}
                    max={1000}
                    placeholder="s in Meter"
                    onWheel={e => e.currentTarget.blur()}
                  />
                </td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m" className="inline-block max-w-full h-auto"></Image></td>
              </tr>
              <tr className="hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Dauer</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.t} alt="t" className="inline-block max-w-full h-auto"></Image></td>
                <td className="py-2 px-2">
                  <StepperInput
                    value={t}
                    onChange={(value) => {
                      setT(value);
                      if (!isNaN(value)) {
                        sessionStorage.setItem('constDrive_t', value.toString());
                      } else {
                        sessionStorage.removeItem('constDrive_t');
                      }
                    }}
                    step={0.1}
                    min={0}
                    max={60}
                    placeholder="t in Sekunden"
                    onWheel={e => e.currentTarget.blur()}
                  />
                </td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.s} alt="s" className="inline-block max-w-full h-auto"></Image></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div id="berechnungen-drive" className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
        <div className="bg-gradient-to-r from-[#0059a9] to-[#003d7a] text-white px-6 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Konstantfahrt</h2>
          <div className="screenshot-buttons flex gap-2">
            <button
              onClick={() => handleClipboard('berechnungen-drive')}
              disabled={isProcessing}
              className="bg-white text-[#0059a9] px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white disabled:opacity-50 disabled:cursor-not-allowed"
              title="In Zwischenablage kopieren"
            >
              {isProcessing ? 'Kopiere...' : 'Kopieren'}
            </button>
            <button
              onClick={() => handleScreenshot('berechnungen-drive', 'berechnungen-konstantfahrt.png')}
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
                <th className="text-[#0059a9] font-semibold text-left py-3 px-2">Art</th>
                <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Var</th>
                <th className="text-[#0059a9] font-semibold text-center py-3 px-2"><span className="text-black">Ein</span> / Ausgabe</th>
                <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Formel</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Geschwindigkeit</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.v} alt="v" className="inline-block max-w-full h-auto"></Image></td>
                <td className="py-2 px-2 text-center font-semibold">{(vIsSet && sIsSet && tIsSet) ? <p className="text-red-600">ERROR</p> : (!vIsSet ? <p className="text-[#0059a9]">{vO}</p> : <p className="text-black">{v.toFixed(2).replace(".", ",")} km/h</p>)}</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.dvF} alt="dvF" className="inline-block max-w-full h-auto"></Image></td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Strecke</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.s} alt="s" className="inline-block max-w-full h-auto"></Image></td>
                <td className="py-2 px-2 text-center font-semibold">{(vIsSet && sIsSet && tIsSet) ? <p className="text-red-600">ERROR</p> : (!sIsSet ? <p className="text-[#0059a9]">{sO}</p> : <p className="text-black">{s.toFixed(2).replace(".", ",")} m</p>)}</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.dsF} alt="dsF" className="inline-block max-w-full h-auto"></Image></td>
              </tr>
              <tr className="hover:bg-blue-50 transition-colors">
                <td className="py-2 px-2 font-medium text-gray-700">Dauer</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.t} alt="t" className="inline-block max-w-full h-auto"></Image></td>
                <td className="py-2 px-2 text-center font-semibold">{(vIsSet && sIsSet && tIsSet) ? <p className="text-red-600">ERROR</p> : (!tIsSet ? <p className="text-[#0059a9]">{tO}</p> : <p className="text-black">{t.toFixed(2).replace(".", ",")} s</p>)}</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.dtF} alt="dtF" className="inline-block max-w-full h-auto"></Image></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default ConstDrive
