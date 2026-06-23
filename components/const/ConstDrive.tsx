import * as util from '../utilConst'
import { useState, useEffect } from "react";
import Image from 'next/image'
import SVG from '../../assets/svg'
import { useScreenshot } from '../../hooks/useScreenshot'
import StepperInput from '../StepperInput'


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

  const vO = (sIsSet && tIsSet) ? util.getSpeed(s, t) : "-"
  const sO = (vIsSet && tIsSet) ? util.getDistance(v, t) : "-"
  const tO = (sIsSet && vIsSet) ? util.getTime(s, v) : "-"

  return (
    <>
      <div className="calculator-card">
        <div className="calculator-card-header">
          <h2 className="text-lg font-semibold">Konstantfahrt</h2>
          <button
            onClick={handleReset}
            className="calculator-header-button"
            title="Alle Eingaben zurücksetzen"
          >
            Reset
          </button>
        </div>
        <div className="p-4">
          <table className="calculator-table">
            <thead>
              <tr className="border-b-2 border-primary-700">
                <th className="text-primary-700 font-semibold text-left py-3 px-2">Art</th>
                <th className="text-primary-700 font-semibold text-center py-3 px-2">Var</th>
                <th className="text-primary-700 font-semibold text-center py-3 px-2">Eingabe</th>
                <th className="text-primary-700 font-semibold text-center py-3 px-2">Einheit</th>
              </tr>
            </thead>
            <tbody>
              <tr className="calculator-row">
                <td className="py-2 px-2 font-medium text-gray-700">Geschwindigkeit</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.v} alt="v" className="inline-block h-auto w-auto max-w-full"></Image></td>
                <td className="py-2 px-2">
                  <div className="flex justify-center">
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
                      className="w-32"
                    />
                  </div>
                </td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.kmh} alt="kmh" className="inline-block h-auto w-auto max-w-full"></Image></td>
              </tr>
              <tr className="calculator-row">
                <td className="py-2 px-2 font-medium text-gray-700">Strecke</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.s} alt="s" className="inline-block h-auto w-auto max-w-full"></Image></td>
                <td className="py-2 px-2">
                  <div className="flex justify-center">
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
                      className="w-32"
                    />
                  </div>
                </td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m" className="inline-block h-auto w-auto max-w-full"></Image></td>
              </tr>
              <tr className="calculator-row-last">
                <td className="py-2 px-2 font-medium text-gray-700">Dauer</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.t} alt="t" className="inline-block h-auto w-auto max-w-full"></Image></td>
                <td className="py-2 px-2">
                  <div className="flex justify-center">
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
                      className="w-32"
                    />
                  </div>
                </td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.s} alt="s" className="inline-block h-auto w-auto max-w-full"></Image></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div id="berechnungen-drive" className="calculator-card">
        <div className="calculator-card-header">
          <h2 className="text-lg font-semibold">Konstantfahrt</h2>
          <div className="screenshot-buttons flex gap-2">
            <button
              onClick={() => handleClipboard('berechnungen-drive')}
              disabled={isProcessing}
              className="calculator-header-button disabled:opacity-50 disabled:cursor-not-allowed"
              title="In Zwischenablage kopieren"
            >
              {isProcessing ? 'Kopiere...' : 'Kopieren'}
            </button>
            <button
              onClick={() => handleScreenshot('berechnungen-drive', 'berechnungen-konstantfahrt.png')}
              disabled={isProcessing}
              className="calculator-header-button-outline disabled:opacity-50 disabled:cursor-not-allowed"
              title="Als PNG herunterladen"
            >
              {isProcessing ? 'Lade...' : 'Download'}
            </button>
          </div>
        </div>
        <div className="p-4">
          <table className="calculator-table calculator-result-table">
            <thead>
              <tr className="border-b-2 border-primary-700">
                <th className="text-primary-700 font-semibold text-left py-3 px-2">Art</th>
                <th className="text-primary-700 font-semibold text-center py-3 px-2">Var</th>
                <th className="text-primary-700 font-semibold text-center py-3 px-2"><span className="text-slate-900">Ein</span><span className="text-slate-400"> / </span><span className="text-primary-700">Ausgabe</span></th>
                <th className="text-primary-700 font-semibold text-center py-3 px-2">Formel</th>
              </tr>
            </thead>
            <tbody>
              <tr className="calculator-row">
                <td className="py-2 px-2 font-medium text-gray-700">Geschwindigkeit</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.v} alt="v" className="inline-block h-auto w-auto max-w-full"></Image></td>
                <td className="py-2 px-2 text-center font-semibold">{(vIsSet && sIsSet && tIsSet) ? <p className="text-red-600">ERROR</p> : (!vIsSet ? <p className="text-primary-700">{vO}</p> : <p className="text-black">{v.toFixed(2).replace(".", ",")} km/h</p>)}</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.dvF} alt="dvF" className="inline-block h-auto w-auto max-w-full"></Image></td>
              </tr>
              <tr className="calculator-row">
                <td className="py-2 px-2 font-medium text-gray-700">Strecke</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.s} alt="s" className="inline-block h-auto w-auto max-w-full"></Image></td>
                <td className="py-2 px-2 text-center font-semibold">{(vIsSet && sIsSet && tIsSet) ? <p className="text-red-600">ERROR</p> : (!sIsSet ? <p className="text-primary-700">{sO}</p> : <p className="text-black">{s.toFixed(2).replace(".", ",")} m</p>)}</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.dsF} alt="dsF" className="inline-block h-auto w-auto max-w-full"></Image></td>
              </tr>
              <tr className="calculator-row-last">
                <td className="py-2 px-2 font-medium text-gray-700">Dauer</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.t} alt="t" className="inline-block h-auto w-auto max-w-full"></Image></td>
                <td className="py-2 px-2 text-center font-semibold">{(vIsSet && sIsSet && tIsSet) ? <p className="text-red-600">ERROR</p> : (!tIsSet ? <p className="text-primary-700">{tO}</p> : <p className="text-black">{t.toFixed(2).replace(".", ",")} s</p>)}</td>
                <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.dtF} alt="dtF" className="inline-block h-auto w-auto max-w-full"></Image></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default ConstDrive
