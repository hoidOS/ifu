import Head from 'next/head'

import * as util from '../components/utilConst'
import { useState } from "react";
import Image from 'next/image'
import SVG from '../assets/svg'

function Sonst() {

  const [p, pset] = useState<number>(NaN)
  const [alpha, alphaset] = useState<number>(NaN)

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
          <div className="bg-[#0059a9] text-white px-6 py-3">
            <h2 className="text-lg font-semibold">Status</h2>
          </div>
          <div className="p-6 flex justify-center items-center">
            <h2 className="text-rose-600">IN BEARBEITUNG</h2>
          </div>
        </div>
        <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
          <div className="bg-[#0059a9] text-white px-6 py-3">
            <h2 className="text-lg font-semibold">Status</h2>
          </div>
          <div className="p-6 flex justify-center items-center">
            <h2 className="text-rose-600">IN BEARBEITUNG</h2>
          </div>
        </div>

        <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
          <div className="bg-[#0059a9] text-white px-6 py-3">
            <h2 className="text-lg font-semibold">Steigungsverzögerung</h2>
          </div>
          <div className="p-6">
          <table>
            <tbody>
              <tr>
                <th>Art</th>
                <th>Var</th>
                <th>Eingabe</th>
                <th>Symbol</th>
              </tr>
              <tr>
                <th>Steigung</th>
                <th><Image src={SVG.p} alt="vA" className="inline-block max-w-full h-auto"></Image></th>
                <th>
                  <div>
                    <input type="number" placeholder="%" defaultValue={''} onWheel={e => e.currentTarget.blur()} onChange={(e) => pset(e.target.valueAsNumber)} />
                  </div>
                </th>
                <th><Image src={SVG.percent} alt="vA" className="inline-block max-w-full h-auto"></Image></th>
              </tr>
              <tr>
                <th>Steigungswinkel</th>
                <th><Image src={SVG.alpha} alt="vA" className="inline-block max-w-full h-auto"></Image></th>
                <th>
                  <div>
                    <input type="number" placeholder="°" defaultValue={''} onWheel={e => e.currentTarget.blur()} onChange={(e) => alphaset(e.target.valueAsNumber)} />
                  </div>
                </th>
                <th><Image src={SVG.degree} alt="vA" className="inline-block max-w-full h-auto"></Image></th>
              </tr>
            </tbody>
          </table>
          </div>
        </div>

        <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
          <div className="bg-[#0059a9] text-white px-6 py-3">
            <h2 className="text-lg font-semibold">Ergebnisse</h2>
          </div>
          <div className="p-6">
          <table>
            <tbody>
              <tr>
                <th>Art</th>
                <th>Var</th>
                <th><span className="text-[#0059a9]">Ein</span> / Ausgabe</th>
                <th>Formel</th>
              </tr>
              <tr>
                <th>Steigung</th>
                <th><Image src={SVG.p} alt="vA" className="inline-block max-w-full h-auto"></Image></th>
                <th>{isError() ? <p className="text-red-500">ERROR</p> : (convAlpha() ? convAlpha() : <p className="text-[#0059a9]">{p.toFixed(2).replace(".", ",")} %</p>)}</th>
                <th><Image src={SVG.alphaToP} alt="dtF" className="inline-block max-w-full h-auto"></Image></th>
              </tr>
              <tr>
                <th>Steigungswinkel</th>
                <th><Image src={SVG.alpha} alt="vA" className="inline-block max-w-full h-auto"></Image></th>
                <th>{isError() ? <p className="text-red-500">ERROR</p> : (convP() ? convP() : <p className="text-[#0059a9]">{alpha.toFixed(2).replace(".", ",")} °</p>)}</th>
                <th><Image src={SVG.pToAlpha} alt="dtF" className="inline-block max-w-full h-auto"></Image></th>
              </tr>
              <tr>
                <th>Steigungsverzögerung</th>
                <th><Image src={SVG.a} alt="vA" className="inline-block max-w-full h-auto"></Image></th>
                <th>{isError() ? <p className="text-red-500">ERROR</p> : (accel() || <p className="text-gray-400">-</p>)}</th>
                <th><Image src={SVG.asteig} alt="asteig" className="inline-block max-w-full h-auto"></Image></th>
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
