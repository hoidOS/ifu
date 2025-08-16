import Head from 'next/head'

import * as util from '../components/utilConst'
import { useState, useEffect } from "react";
import Image from 'next/image'
import SVG from '../assets/svg'
import { useScreenshot } from '../hooks/useScreenshot'
import StepperInput from '../components/StepperInput'

function Sonst() {

  const [p, pset] = useState<number>(NaN)
  const [alpha, alphaset] = useState<number>(NaN)
  
  const { isProcessing, handleScreenshot, handleClipboard } = useScreenshot();

  // Load saved values from sessionStorage on component mount
  useEffect(() => {
    const savedP = sessionStorage.getItem('sonst_p');
    const savedAlpha = sessionStorage.getItem('sonst_alpha');

    if (savedP && !isNaN(parseFloat(savedP))) pset(parseFloat(savedP));
    if (savedAlpha && !isNaN(parseFloat(savedAlpha))) alphaset(parseFloat(savedAlpha));
  }, []);

  // Reset function to clear all input fields and sessionStorage
  const handleReset = () => {
    pset(NaN);
    alphaset(NaN);

    // Clear from sessionStorage
    sessionStorage.removeItem('sonst_p');
    sessionStorage.removeItem('sonst_alpha');
  };

  const convP = (): string | boolean => {
    if (isNaN(p) || p < 0) {
      return false;
    }

    if (p === 0) {
      return "0,00°";
    }

    // Tangent of the angle is the percent incline divided by 100
    const tangentOfAngle = p / 100;

    // Calculate the angle in radians using arctangent (atan)
    const angleInRadians = Math.atan(tangentOfAngle);

    // Convert radians to degrees
    const alpha = angleInRadians * (180 / Math.PI);

    // Return the angle in degrees as a string, rounded to a reasonable precision
    return alpha.toFixed(2).replace(".", ",") + '°';
  }

  const convAlpha = (): string | boolean => {
    if (isNaN(alpha) || alpha < 0 || alpha > 90) {
      return false;
    }

    if (alpha === 0) {
      return "0,00%";
    }

    // Calculate the tangent of the angle
    const tangentOfAngle = Math.tan(alpha * (Math.PI / 180));

    // Convert tangent to percentage
    const percentIncline = tangentOfAngle * 100;

    // Return the percent incline rounded to a reasonable precision
    return percentIncline.toFixed(2).replace(".", ",") + '%';
  }

  const accel = (): string | boolean => {
    let angleToUse = 0;
    
    if (!isNaN(alpha) && alpha >= 0 && alpha <= 90) {
      angleToUse = alpha;
    } else if (!isNaN(p) && p >= 0) {
      const tangentOfAngle = p / 100;
      const angleInRadians = Math.atan(tangentOfAngle);
      angleToUse = angleInRadians * (180 / Math.PI);
    } else {
      return false;
    }

    const out = 9.81 * Math.sin(angleToUse * (Math.PI / 180.0));
    return out.toFixed(2).replace(".", ",") + " m/s²";
  }

  const isError = (): boolean => {
    return (!isNaN(p) && p > 0) && (!isNaN(alpha) && alpha > 0);
  }


  return (

    <div className="grid gap-6 mx-auto max-w-7xl px-4 py-8 xl:grid-cols-2">
      <Head>
        <title>PPCAVS | Sonstiges</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width" />
      </Head>
      <>
        <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
          <div className="bg-gradient-to-r from-[#0059a9] to-[#003d7a] text-white px-6 py-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Steigungsverzögerung</h2>
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
                  <td className="py-2 px-2 font-medium text-gray-700">Steigung</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.p} alt="p" className="inline-block max-w-full h-auto"></Image></td>
                  <td className="py-2 px-2">
                    <StepperInput
                      value={p}
                      onChange={(value) => {
                        pset(value);
                        if (!isNaN(value)) {
                          sessionStorage.setItem('sonst_p', value.toString());
                        } else {
                          sessionStorage.removeItem('sonst_p');
                        }
                      }}
                      step={0.1}
                      min={0}
                      max={100}
                      placeholder="p in %"
                      onWheel={e => e.currentTarget.blur()}
                    />
                  </td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.percent} alt="%" className="inline-block max-w-full h-auto"></Image></td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Steigungswinkel</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.alpha} alt="alpha" className="inline-block max-w-full h-auto"></Image></td>
                  <td className="py-2 px-2">
                    <StepperInput
                      value={alpha}
                      onChange={(value) => {
                        alphaset(value);
                        if (!isNaN(value)) {
                          sessionStorage.setItem('sonst_alpha', value.toString());
                        } else {
                          sessionStorage.removeItem('sonst_alpha');
                        }
                      }}
                      step={0.1}
                      min={0}
                      max={90}
                      placeholder="α in °"
                      onWheel={e => e.currentTarget.blur()}
                    />
                  </td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.degree} alt="°" className="inline-block max-w-full h-auto"></Image></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div id="berechnungen-sonst" className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
          <div className="bg-gradient-to-r from-[#0059a9] to-[#003d7a] text-white px-6 py-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Steigungsverzögerung Ergebnisse</h2>
            <div className="screenshot-buttons flex gap-2">
              <button
                onClick={() => handleClipboard('berechnungen-sonst')}
                disabled={isProcessing}
                className="bg-white text-[#0059a9] px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white disabled:opacity-50 disabled:cursor-not-allowed"
                title="In Zwischenablage kopieren"
              >
                {isProcessing ? 'Kopiere...' : 'Kopieren'}
              </button>
              <button
                onClick={() => handleScreenshot('berechnungen-sonst', 'berechnungen-steigungsverzoegerung.png')}
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
                  <th className="text-[#0059a9] font-semibold text-center py-3 px-2"><span className="text-[#0059a9]">Ein</span> / Ausgabe</th>
                  <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Formel</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Steigung</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.p} alt="p" className="inline-block max-w-full h-auto"></Image></td>
                  <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{isError() ? <p className="text-red-500">ERROR</p> : (convAlpha() ? convAlpha() : <p className="text-[#0059a9]">{p.toFixed(2).replace(".", ",")} %</p>)}</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.alphaToP} alt="alphaToP" className="inline-block max-w-full h-auto"></Image></td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Steigungswinkel</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.alpha} alt="alpha" className="inline-block max-w-full h-auto"></Image></td>
                  <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{isError() ? <p className="text-red-500">ERROR</p> : (convP() ? convP() : <p className="text-[#0059a9]">{alpha.toFixed(2).replace(".", ",")} °</p>)}</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.pToAlpha} alt="pToAlpha" className="inline-block max-w-full h-auto"></Image></td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Steigungsverzögerung</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.a} alt="a" className="inline-block max-w-full h-auto"></Image></td>
                  <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{isError() ? <p className="text-red-500">ERROR</p> : (accel() || <p className="text-gray-400">-</p>)}</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.asteig} alt="asteig" className="inline-block max-w-full h-auto"></Image></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </>
    </div>
  )
}

export default Sonst
