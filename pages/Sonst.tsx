import Head from 'next/head'

import * as util from '../components/utilConst'
import { useState } from "react";
import Image from 'next/image'
import SVG from '../assets/svg'

function Sonst() {

  const [p, pset] = useState<number>(NaN)
  const [alpha, alphaset] = useState<number>(NaN)

  //FIXME: 
  const convP = (): string | boolean => {
    // Tangent of the angle is the percent incline divided by 100
    const tangentOfAngle = p / 100;

    // Calculate the angle in radians using arctangent (atan)
    const angleInRadians = Math.atan(tangentOfAngle);

    // Convert radians to degrees
    const alpha = angleInRadians * (180 / Math.PI);

    if (p > 0) {
      // Return the angle in degrees as a string, rounded to a reasonable precision if needed
      return alpha.toFixed(2).replace(".", ",") + '°';

    } else {
      return false
    }
  }

  //FIXME: 
  const convAlpha = (): string | boolean => {
    // Ensure the angle is within the valid range for this calculation (0 to 90 degrees)
    if (alpha < 0 || alpha > 90) {
      return "Angle must be between 0 and 90 degrees";
    }

    // Calculate the tangent of the angle
    const tangentOfAngle = Math.tan(alpha * (Math.PI / 180));

    // Convert tangent to percentage
    const percentIncline = tangentOfAngle * 100;

    if (alpha > 0 && alpha <= 90) {
      // Return the percent incline rounded to a reasonable precision
      return percentIncline.toFixed(2).replace(".", ",") + '%';
    } else {
      return false
    }

  }

  //FIXME: 
  const accel = (): string => {
    if (alpha > 0) {
      const out = 9.81 * Math.sin(alpha * (Math.PI / 180.0));
      return out.toFixed(2).replace(".", ",") + " m/s²";
    }
    if (p > 0) {
      const tangentOfAngle = p / 100;
      const angleInRadians = Math.atan(tangentOfAngle);
      const temp = angleInRadians * (180 / Math.PI);

      const out = 9.81 * Math.sin(temp * (Math.PI / 180.0));
      return out.toFixed(2).replace(".", ",") + " m/s²";
    }
    return "ERROR"
  }

  //FIXME: 
  const isError = (): boolean => {
    if (p > 0 && alpha > 0) {
      return true
    }
    return false
  }


  return (

    <div className="grid xl:grid-cols-2 m-0 gap-5 p-4">
      <Head>
        <title>PPCAVS | Sonstiges</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width" />
      </Head>
      <>
        <div className="flex bg-[#0059a9] border-[1.25rem] border-[#0059a9] rounded-xl justify-center items-center">
          <h1 className="text-rose-600">IN BEARBEITUNG</h1>
        </div>
        <div className="flex bg-[#0059a9] border-[1.25rem] border-[#0059a9] rounded-xl justify-center items-center">
          <h1 className="text-rose-600">IN BEARBEITUNG</h1>
        </div>

        <div className="flex bg-[#0059a9] border-[1.25rem] border-[#0059a9] rounded-xl">
          <h1 className="pr-6 text-center text-[#fff] self-center">Steigungsverzögerung</h1>
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
                <th><Image src={SVG.p} alt="vA" className="absolute z-0"></Image></th>
                <th>
                  <div>
                    <input type="number" placeholder="%" defaultValue={''} onWheel={e => e.currentTarget.blur()} onChange={(e) => pset(e.target.valueAsNumber)} />
                  </div>
                </th>
                <th><Image src={SVG.percent} alt="vA" className="absolute z-0"></Image></th>
              </tr>
              <tr>
                <th>Steigungswinkel</th>
                <th><Image src={SVG.alpha} alt="vA" className="absolute z-0"></Image></th>
                <th>
                  <div>
                    <input type="number" placeholder="°" defaultValue={''} onWheel={e => e.currentTarget.blur()} onChange={(e) => alphaset(e.target.valueAsNumber)} />
                  </div>
                </th>
                <th><Image src={SVG.degree} alt="vA" className="absolute z-0"></Image></th>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex bg-[#0059a9] border-[1.25rem] border-[#0059a9] rounded-xl">
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
                <th><Image src={SVG.p} alt="vA" className="absolute z-0"></Image></th>
                <th>{isError() ? <p className="text-red-500">ERROR</p> : (convAlpha() ? convAlpha() : <p className="text-[#0059a9]">{p.toFixed(2).replace(".", ",")} %</p>)}</th>
                <th><Image src={SVG.alphaToP} alt="dtF" ></Image></th>
              </tr>
              <tr>
                <th>Steigungswinkel</th>
                <th><Image src={SVG.alpha} alt="vA" className="absolute z-0"></Image></th>
                <th>{isError() ? <p className="text-red-500">ERROR</p> : (convP() ? convP() : <p className="text-[#0059a9]">{alpha.toFixed(2).replace(".", ",")} °</p>)}</th>
                <th><Image src={SVG.pToAlpha} alt="dtF" ></Image></th>
              </tr>
              <tr>
                <th>Steigungsverzögerung</th>
                <th><Image src={SVG.a} alt="vA" className="absolute z-0"></Image></th>
                <th>{isError() ? <p className="text-red-500">ERROR</p> : (accel() ? accel() : <p className="text-[#0059a9]">{p.toFixed(2).replace(".", ",")} %</p>)}</th>
                <th><Image src={SVG.asteig} alt="asteig" ></Image></th>
              </tr>
            </tbody>
          </table>
        </div>

      </>
    </div>
  )
}

export default Sonst
