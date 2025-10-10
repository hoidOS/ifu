import Head from 'next/head'

import { useState, useEffect } from "react";
import Image from 'next/image'
import SVG from '../assets/svg'
import { useScreenshot } from '../hooks/useScreenshot'
import StepperInput from '../components/StepperInput'

function Sonst() {

  const [p, pset] = useState<number>(NaN)
  const [alpha, alphaset] = useState<number>(NaN)

  // Curve radius calculation states
  const [h, hset] = useState<number>(NaN) // Segmenthöhe
  const [s, sset] = useState<number>(NaN) // Segmentlänge  
  const [b, bset] = useState<number>(NaN) // Bogenlänge

  // Curve speed calculation states
  const [R, Rset] = useState<number>(NaN) // Kurvenradius
  const [muR, muRset] = useState<number>(NaN) // Reibwert
  const [ue, ueset] = useState<number>(NaN) // Überhoehung

  const defaultAusscherKsn = 2.67

  // Lane change (Ausschervorgänge) states
  const [ausscherV, ausscherVSet] = useState<number>(NaN) // Geschwindigkeit
  const [ausscherB, ausscherBSet] = useState<number>(NaN) // Spurwechselbreite
  const [ausscherKsn, ausscherKsnSet] = useState<number>(defaultAusscherKsn) // Spurwechselfaktor
  const [ausscherAqn, ausscherAqnSet] = useState<number>(NaN) // Querbeschleunigung normal
  const [ausscherAqs, ausscherAqsSet] = useState<number>(NaN) // Querbeschleunigung scharf

  const { isProcessing, handleScreenshot, handleClipboard } = useScreenshot();

  // Load saved values from sessionStorage on component mount
  useEffect(() => {
    const savedP = sessionStorage.getItem('sonst_p');
    const savedAlpha = sessionStorage.getItem('sonst_alpha');
    const savedH = sessionStorage.getItem('sonst_h');
    const savedS = sessionStorage.getItem('sonst_s');
    const savedB = sessionStorage.getItem('sonst_b');
    const savedR = sessionStorage.getItem('sonst_R');
    const savedMuR = sessionStorage.getItem('sonst_muR');
    const savedUe = sessionStorage.getItem('sonst_ue');
    const savedAusscherV = sessionStorage.getItem('sonst_ausscher_v');
    const savedAusscherB = sessionStorage.getItem('sonst_ausscher_b');
    const savedAusscherKsn = sessionStorage.getItem('sonst_ausscher_ksn');
    const savedAusscherAqn = sessionStorage.getItem('sonst_ausscher_aqn');
    const savedAusscherAqs = sessionStorage.getItem('sonst_ausscher_aqs');

    if (savedP && !isNaN(parseFloat(savedP))) pset(parseFloat(savedP));
    if (savedAlpha && !isNaN(parseFloat(savedAlpha))) alphaset(parseFloat(savedAlpha));
    if (savedH && !isNaN(parseFloat(savedH))) hset(parseFloat(savedH));
    if (savedS && !isNaN(parseFloat(savedS))) sset(parseFloat(savedS));
    if (savedB && !isNaN(parseFloat(savedB))) bset(parseFloat(savedB));
    if (savedR && !isNaN(parseFloat(savedR))) Rset(parseFloat(savedR));
    if (savedMuR && !isNaN(parseFloat(savedMuR))) muRset(parseFloat(savedMuR));
    if (savedUe && !isNaN(parseFloat(savedUe))) ueset(parseFloat(savedUe));
    if (savedAusscherV && !isNaN(parseFloat(savedAusscherV))) ausscherVSet(parseFloat(savedAusscherV));
    if (savedAusscherB && !isNaN(parseFloat(savedAusscherB))) ausscherBSet(parseFloat(savedAusscherB));
    if (savedAusscherKsn && !isNaN(parseFloat(savedAusscherKsn))) ausscherKsnSet(parseFloat(savedAusscherKsn));
    if (savedAusscherAqn && !isNaN(parseFloat(savedAusscherAqn))) ausscherAqnSet(parseFloat(savedAusscherAqn));
    if (savedAusscherAqs && !isNaN(parseFloat(savedAusscherAqs))) ausscherAqsSet(parseFloat(savedAusscherAqs));
  }, []);

  // Reset function to clear all input fields and sessionStorage
  const handleReset = () => {
    pset(NaN);
    alphaset(NaN);

    // Clear from sessionStorage
    sessionStorage.removeItem('sonst_p');
    sessionStorage.removeItem('sonst_alpha');
  };

  // Reset function for curve radius calculations
  const handleResetCurve = () => {
    hset(NaN);
    sset(NaN);
    bset(NaN);

    // Clear from sessionStorage
    sessionStorage.removeItem('sonst_h');
    sessionStorage.removeItem('sonst_s');
    sessionStorage.removeItem('sonst_b');
  };

  // Reset function for curve speed calculations
  const handleResetSpeed = () => {
    Rset(NaN);
    muRset(NaN);
    ueset(NaN);

    // Clear from sessionStorage
    sessionStorage.removeItem('sonst_R');
    sessionStorage.removeItem('sonst_muR');
    sessionStorage.removeItem('sonst_ue');
  };

  const handleResetAusscher = () => {
    ausscherVSet(NaN);
    ausscherBSet(NaN);
    ausscherKsnSet(defaultAusscherKsn);
    ausscherAqnSet(NaN);
    ausscherAqsSet(NaN);

    sessionStorage.removeItem('sonst_ausscher_v');
    sessionStorage.removeItem('sonst_ausscher_b');
    sessionStorage.setItem('sonst_ausscher_ksn', defaultAusscherKsn.toString());
    sessionStorage.removeItem('sonst_ausscher_aqn');
    sessionStorage.removeItem('sonst_ausscher_aqs');
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

  // Curve radius calculation functions
  const calculateRadius = (): string | boolean => {
    if (!isNaN(h) && !isNaN(s) && h > 0 && s > 0) {
      // R = (s²/8h) + (h/2)
      const radius = (Math.pow(s, 2) / (8 * h)) + (h / 2);
      return radius.toFixed(2).replace(".", ",") + " m";
    }
    return false;
  }

  const calculateZentriwinkel = (): string | boolean => {
    const radius = calculateRadius();
    if (radius && !isNaN(h) && !isNaN(s) && h > 0 && s > 0) {
      const R = parseFloat(radius.toString().replace(",", ".").replace(" m", ""));
      // Calculate central angle: θ = 2 * arcsin(s/(2*R))
      const thetaRadians = 2 * Math.asin(s / (2 * R));
      // Convert to degrees
      const thetaDegrees = thetaRadians * (180 / Math.PI);
      return thetaDegrees.toFixed(2).replace(".", ",") + "°";
    }
    return false;
  }

  const calculateBogenlange = (): string | boolean => {
    const radius = calculateRadius();
    if (radius && !isNaN(h) && !isNaN(s) && h > 0 && s > 0) {
      const R = parseFloat(radius.toString().replace(",", ".").replace(" m", ""));
      // Calculate central angle: θ = 2 * arcsin(s/(2*R))
      const theta = 2 * Math.asin(s / (2 * R));
      // Arc length: b = R * θ
      const arcLength = R * theta;
      return arcLength.toFixed(2).replace(".", ",") + " m";
    }
    return false;
  }

  const isCurveError = (): boolean => {
    let inputCount = 0;
    if (!isNaN(h) && h > 0) inputCount++;
    if (!isNaN(s) && s > 0) inputCount++;
    if (!isNaN(b) && b > 0) inputCount++;
    return inputCount > 2; // Error if more than 2 inputs are provided
  }

  // Curve speed calculation functions
  const calculateCurveSpeed = (): string | boolean => {
    if (!isNaN(R) && !isNaN(muR) && R > 0 && muR > 0) {
      // Excel formula: v = 3.6*SQRT((9.81*R*(μR+(e/100)))/(1-μR*(e/100)))
      // where e is the banking percentage (ue)
      const bankingDecimal = !isNaN(ue) && ue >= 0 ? ue / 100 : 0;
      const numerator = 9.81 * R * (muR + bankingDecimal);
      const denominator = 1 - (muR * bankingDecimal);

      // Avoid division by zero or negative values
      if (denominator <= 0) {
        return false;
      }

      const speedKmh = 3.6 * Math.sqrt(numerator / denominator);
      return speedKmh.toFixed(2).replace(".", ",") + " km/h";
    }
    return false;
  }

  const isSpeedError = (): boolean => {
    // No specific error conditions for speed calculation
    return false;
  }

  const percentFromAlpha = convAlpha();
  const angleFromPercent = convP();
  const accelValue = accel();
  const radiusResult = calculateRadius();
  const zentriwinkelResult = calculateZentriwinkel();
  const bogenlangeResult = calculateBogenlange();
  const curveSpeedResult = calculateCurveSpeed();
  const ausscherDurationNormalValue = (!isNaN(ausscherKsn) && ausscherKsn > 0 && !isNaN(ausscherB) && ausscherB > 0 && !isNaN(ausscherAqn) && ausscherAqn > 0)
    ? ausscherKsn * Math.sqrt(ausscherB / ausscherAqn)
    : null;
  const ausscherDurationSharpValue = (!isNaN(ausscherKsn) && ausscherKsn > 0 && !isNaN(ausscherB) && ausscherB > 0 && !isNaN(ausscherAqs) && ausscherAqs > 0)
    ? ausscherKsn * Math.sqrt(ausscherB / ausscherAqs)
    : null;
  const ausscherSpeedMs = !isNaN(ausscherV) && ausscherV >= 0 ? ausscherV / 3.6 : null;
  const ausscherDistanceNormalValue = (ausscherSpeedMs !== null && ausscherDurationNormalValue !== null)
    ? ausscherSpeedMs * ausscherDurationNormalValue
    : null;
  const ausscherDistanceSharpValue = (ausscherSpeedMs !== null && ausscherDurationSharpValue !== null)
    ? ausscherSpeedMs * ausscherDurationSharpValue
    : null;

  return (

    <div className="grid gap-6 mx-auto max-w-7xl px-4 py-8 xl:grid-cols-2">
      <Head>
        <title>PPCAVS | Sonstiges</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width" />
      </Head>
      <>
        <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
          <div className="bg-gradient-to-r from-primary-700 to-primary-800 text-white px-6 py-3 card-header flex justify-between items-center">
            <h2 className="text-lg font-semibold">Steigungsverzögerung</h2>
            <button
              onClick={handleReset}
              className="bg-white text-primary-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white"
              title="Alle Eingaben zurücksetzen"
            >
              Reset
            </button>
          </div>
          <div className="p-4">
            <table className="w-full text-sm border border-primary-700 rounded-lg overflow-hidden shadow-md shadow-blue-200/50 border-b-2 border-r-2">
              <thead>
                <tr className="border-b-2 border-primary-700">
                  <th className="text-primary-700 font-semibold text-left py-3 px-2">Art</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Var</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Eingabe</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Einheit</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Steigung</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.p} alt="p" className="inline-block max-w-full h-auto"></Image></td>
                  <td className="py-2 px-2">
                    <div className="flex justify-center">
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
                        className="w-28"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.percent} alt="%" className="inline-block max-w-full h-auto"></Image></td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Steigungswinkel</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.alpha} alt="alpha" className="inline-block max-w-full h-auto"></Image></td>
                  <td className="py-2 px-2">
                    <div className="flex justify-center">
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
                        className="w-28"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.degree} alt="°" className="inline-block max-w-full h-auto"></Image></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div id="berechnungen-sonst" className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
          <div className="bg-gradient-to-r from-primary-700 to-primary-800 text-white px-6 py-3 card-header flex justify-between items-center">
            <h2 className="text-lg font-semibold">Steigungsverzögerung Ergebnisse</h2>
            <div className="screenshot-buttons flex gap-2">
              <button
                onClick={() => handleClipboard('berechnungen-sonst')}
                disabled={isProcessing}
                className="bg-white text-primary-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white disabled:opacity-50 disabled:cursor-not-allowed"
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
            <table className="w-full text-sm border border-primary-700 rounded-lg overflow-hidden shadow-md shadow-blue-200/50 border-b-2 border-r-2">
              <thead>
                <tr className="border-b-2 border-primary-700">
                  <th className="text-primary-700 font-semibold text-left py-3 px-2">Art</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Var</th>
                <th className="text-primary-700 font-semibold text-center py-3 px-2"><span className="text-black">Ein</span> / Ausgabe</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Formel</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Steigung</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.p} alt="p" className="inline-block max-w-full h-auto"></Image></td>
                <td className="py-2 px-2 text-center font-semibold">{isError() ? <p className="text-red-500">ERROR</p> : (percentFromAlpha ? <p className="text-primary-700">{percentFromAlpha}</p> : (!isNaN(p) && p >= 0 ? <p className="text-black">{p.toFixed(2).replace(".", ",")} %</p> : <p className="text-primary-700">-</p>))}</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.alphaToP} alt="alphaToP" className="inline-block max-w-full h-auto"></Image></td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Steigungswinkel</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.alpha} alt="alpha" className="inline-block max-w-full h-auto"></Image></td>
                <td className="py-2 px-2 text-center font-semibold">{isError() ? <p className="text-red-500">ERROR</p> : (angleFromPercent ? <p className="text-primary-700">{angleFromPercent}</p> : (!isNaN(alpha) && alpha >= 0 ? <p className="text-black">{alpha.toFixed(2).replace(".", ",")} °</p> : <p className="text-primary-700">-</p>))}</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.pToAlpha} alt="pToAlpha" className="inline-block max-w-full h-auto"></Image></td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Steigungsverzögerung</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.a} alt="a" className="inline-block max-w-full h-auto"></Image></td>
                <td className="py-2 px-2 text-center font-semibold">{isError() ? <p className="text-red-500">ERROR</p> : (accelValue ? <p className="text-primary-700">{accelValue}</p> : <p className="text-primary-700">-</p>)}</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.asteig} alt="asteig" className="inline-block max-w-full h-auto"></Image></td>
                </tr>
              </tbody>
            </table>
        </div>
      </div>

        {/* Lane Change Input Section */}
        <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
          <div className="bg-gradient-to-r from-primary-700 to-primary-800 text-white px-6 py-3 card-header flex justify-between items-center">
            <h2 className="text-lg font-semibold">Ausschervorgänge</h2>
            <button
              onClick={handleResetAusscher}
              className="bg-white text-primary-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white"
              title="Alle Eingaben zurücksetzen"
            >
              Reset
            </button>
          </div>
          <div className="p-4">
            <table className="w-full text-sm border border-primary-700 rounded-lg overflow-hidden shadow-md shadow-blue-200/50 border-b-2 border-r-2">
              <thead>
                <tr className="border-b-2 border-primary-700">
                  <th className="text-primary-700 font-semibold text-left py-3 px-2">Art</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Var</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Eingabe</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Einheit</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Ausschergeschwindigkeit</td>
                  <td className="py-2 px-2 text-center"><span className="text-primary-700 font-semibold">v</span></td>
                  <td className="py-2 px-2">
                    <div className="flex justify-center">
                      <StepperInput
                        value={ausscherV}
                        onChange={(value) => {
                          ausscherVSet(value);
                          if (!isNaN(value)) {
                            sessionStorage.setItem('sonst_ausscher_v', value.toString());
                          } else {
                            sessionStorage.removeItem('sonst_ausscher_v');
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
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.kmh} alt="kmh" className="inline-block max-w-full h-auto"></Image></td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Spurwechselbreite</td>
                  <td className="py-2 px-2 text-center"><span className="text-primary-700 font-semibold">B</span></td>
                  <td className="py-2 px-2">
                    <div className="flex justify-center">
                      <StepperInput
                        value={ausscherB}
                        onChange={(value) => {
                          ausscherBSet(value);
                          if (!isNaN(value)) {
                            sessionStorage.setItem('sonst_ausscher_b', value.toString());
                          } else {
                            sessionStorage.removeItem('sonst_ausscher_b');
                          }
                        }}
                        step={0.1}
                        min={0}
                        max={10}
                        placeholder="B in m"
                        onWheel={e => e.currentTarget.blur()}
                        className="w-28"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m" className="inline-block max-w-full h-auto"></Image></td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Spurwechselfaktor</td>
                  <td className="py-2 px-2 text-center"><span className="text-primary-700 font-semibold">K<sub>sn</sub></span></td>
                  <td className="py-2 px-2">
                    <div className="flex justify-center">
                      <StepperInput
                        value={ausscherKsn}
                        onChange={(value) => {
                          ausscherKsnSet(value);
                          if (!isNaN(value)) {
                            sessionStorage.setItem('sonst_ausscher_ksn', value.toString());
                          } else {
                            sessionStorage.removeItem('sonst_ausscher_ksn');
                          }
                        }}
                        step={0.01}
                        min={0}
                        max={10}
                        placeholder="Ksn"
                        onWheel={e => e.currentTarget.blur()}
                        className="w-28"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center">-</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Querbeschleunigung normal</td>
                  <td className="py-2 px-2 text-center"><span className="text-primary-700 font-semibold">a<sub>qn</sub></span></td>
                  <td className="py-2 px-2">
                    <div className="flex justify-center">
                      <StepperInput
                        value={ausscherAqn}
                        onChange={(value) => {
                          ausscherAqnSet(value);
                          if (!isNaN(value)) {
                            sessionStorage.setItem('sonst_ausscher_aqn', value.toString());
                          } else {
                            sessionStorage.removeItem('sonst_ausscher_aqn');
                          }
                        }}
                        step={0.01}
                        min={0}
                        max={10}
                        placeholder="aqn in m/s²"
                        onWheel={e => e.currentTarget.blur()}
                        className="w-28"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.ms2} alt="ms2" className="inline-block max-w-full h-auto"></Image></td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Querbeschleunigung scharf</td>
                  <td className="py-2 px-2 text-center"><span className="text-primary-700 font-semibold">a<sub>qs</sub></span></td>
                  <td className="py-2 px-2">
                    <div className="flex justify-center">
                      <StepperInput
                        value={ausscherAqs}
                        onChange={(value) => {
                          ausscherAqsSet(value);
                          if (!isNaN(value)) {
                            sessionStorage.setItem('sonst_ausscher_aqs', value.toString());
                          } else {
                            sessionStorage.removeItem('sonst_ausscher_aqs');
                          }
                        }}
                        step={0.01}
                        min={0}
                        max={15}
                        placeholder="aqs in m/s²"
                        onWheel={e => e.currentTarget.blur()}
                        className="w-28"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.ms2} alt="ms2" className="inline-block max-w-full h-auto"></Image></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Lane Change Results Section */}
        <div id="berechnungen-ausscher" className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
          <div className="bg-gradient-to-r from-primary-700 to-primary-800 text-white px-6 py-3 card-header flex justify-between items-center">
            <h2 className="text-lg font-semibold">Ausschervorgänge Ergebnisse</h2>
            <div className="screenshot-buttons flex gap-2">
              <button
                onClick={() => handleClipboard('berechnungen-ausscher')}
                disabled={isProcessing}
                className="bg-white text-primary-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white disabled:opacity-50 disabled:cursor-not-allowed"
                title="In Zwischenablage kopieren"
              >
                {isProcessing ? 'Kopiere...' : 'Kopieren'}
              </button>
              <button
                onClick={() => handleScreenshot('berechnungen-ausscher', 'berechnungen-ausschervorgaenge.png')}
                disabled={isProcessing}
                className="bg-transparent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 hover:shadow-sm transition-all duration-200 border border-white disabled:opacity-50 disabled:cursor-not-allowed"
                title="Als PNG herunterladen"
              >
                {isProcessing ? 'Lade...' : 'Download'}
              </button>
            </div>
          </div>
          <div className="p-4">
            <table className="w-full text-sm border border-primary-700 rounded-lg overflow-hidden shadow-md shadow-blue-200/50 border-b-2 border-r-2">
              <thead>
                <tr className="border-b-2 border-primary-700">
                  <th className="text-primary-700 font-semibold text-left py-3 px-2">Art</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Var</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2"><span className="text-black">Ein</span> / Ausgabe</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Formel</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Ausscherdauer normal</td>
                  <td className="py-2 px-2 text-center"><span className="text-primary-700 font-semibold">t<sub>n</sub></span></td>
                  <td className="py-2 px-2 text-center font-semibold">
                    {ausscherDurationNormalValue !== null
                      ? <p className="text-primary-700">{ausscherDurationNormalValue.toFixed(2).replace(".", ",")} s</p>
                      : <p className="text-primary-700">-</p>}
                  </td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.tn} alt="Formel t_n" className="inline-block max-w-full h-auto"></Image></td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Ausscherdauer scharf</td>
                  <td className="py-2 px-2 text-center"><span className="text-primary-700 font-semibold">t<sub>s</sub></span></td>
                  <td className="py-2 px-2 text-center font-semibold">
                    {ausscherDurationSharpValue !== null
                      ? <p className="text-primary-700">{ausscherDurationSharpValue.toFixed(2).replace(".", ",")} s</p>
                      : <p className="text-primary-700">-</p>}
                  </td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.ts} alt="Formel t_s" className="inline-block max-w-full h-auto"></Image></td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Ausscherstrecke normal</td>
                  <td className="py-2 px-2 text-center"><span className="text-primary-700 font-semibold">s<sub>n</sub></span></td>
                  <td className="py-2 px-2 text-center font-semibold">
                    {ausscherDistanceNormalValue !== null
                      ? <p className="text-primary-700">{ausscherDistanceNormalValue.toFixed(2).replace(".", ",")} m</p>
                      : <p className="text-primary-700">-</p>}
                  </td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.sn} alt="Formel s_n" className="inline-block max-w-full h-auto"></Image></td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Ausscherstrecke scharf</td>
                  <td className="py-2 px-2 text-center"><span className="text-primary-700 font-semibold">s<sub>s</sub></span></td>
                  <td className="py-2 px-2 text-center font-semibold">
                    {ausscherDistanceSharpValue !== null
                      ? <p className="text-primary-700">{ausscherDistanceSharpValue.toFixed(2).replace(".", ",")} m</p>
                      : <p className="text-primary-700">-</p>}
                  </td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.ss} alt="Formel s_s" className="inline-block max-w-full h-auto"></Image></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Curve Radius Input Section */}
        <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
          <div className="bg-gradient-to-r from-primary-700 to-primary-800 text-white px-6 py-3 card-header flex justify-between items-center">
            <h2 className="text-lg font-semibold">Kurvenradius</h2>
            <button
              onClick={handleResetCurve}
              className="bg-white text-primary-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white"
              title="Alle Eingaben zurücksetzen"
            >
              Reset
            </button>
          </div>
          <div className="p-4">
            <table className="w-full text-sm border border-primary-700 rounded-lg overflow-hidden shadow-md shadow-blue-200/50 border-b-2 border-r-2">
              <thead>
                <tr className="border-b-2 border-primary-700">
                  <th className="text-primary-700 font-semibold text-left py-3 px-2">Art</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Var</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Eingabe</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Einheit</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Segmenthöhe</td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">h</td>
                  <td className="py-2 px-2">
                    <div className="flex justify-center">
                      <StepperInput
                        value={h}
                        onChange={(value) => {
                          hset(value);
                          if (!isNaN(value)) {
                            sessionStorage.setItem('sonst_h', value.toString());
                          } else {
                            sessionStorage.removeItem('sonst_h');
                          }
                        }}
                        step={0.01}
                        min={0}
                        max={1000}
                        placeholder="h in m"
                        onWheel={e => e.currentTarget.blur()}
                        className="w-32"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700"><Image unoptimized src={SVG.m} alt="m" className="inline-block max-w-full h-auto"></Image></td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Segmentlänge</td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">s</td>
                  <td className="py-2 px-2">
                    <div className="flex justify-center">
                      <StepperInput
                        value={s}
                        onChange={(value) => {
                          sset(value);
                          if (!isNaN(value)) {
                            sessionStorage.setItem('sonst_s', value.toString());
                          } else {
                            sessionStorage.removeItem('sonst_s');
                          }
                        }}
                        step={0.01}
                        min={0}
                        max={1000}
                        placeholder="s in m"
                        onWheel={e => e.currentTarget.blur()}
                        className="w-32"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700"><Image unoptimized src={SVG.m} alt="m" className="inline-block max-w-full h-auto"></Image></td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Bogenlänge</td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">b</td>
                  <td className="py-2 px-2">
                    <div className="flex justify-center">
                      <StepperInput
                        value={b}
                        onChange={(value) => {
                          bset(value);
                          if (!isNaN(value)) {
                            sessionStorage.setItem('sonst_b', value.toString());
                          } else {
                            sessionStorage.removeItem('sonst_b');
                          }
                        }}
                        step={0.01}
                        min={0}
                        max={1000}
                        placeholder="b in m"
                        onWheel={e => e.currentTarget.blur()}
                        className="w-32"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700"><Image unoptimized src={SVG.m} alt="m" className="inline-block max-w-full h-auto"></Image></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Curve Radius Results Section */}
        <div id="berechnungen-kurve" className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
          <div className="bg-gradient-to-r from-primary-700 to-primary-800 text-white px-6 py-3 card-header flex justify-between items-center">
            <h2 className="text-lg font-semibold">Kurvenradius Ergebnisse</h2>
            <div className="screenshot-buttons flex gap-2">
              <button
                onClick={() => handleClipboard('berechnungen-kurve')}
                disabled={isProcessing}
                className="bg-white text-primary-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white disabled:opacity-50 disabled:cursor-not-allowed"
                title="In Zwischenablage kopieren"
              >
                {isProcessing ? 'Kopiere...' : 'Kopieren'}
              </button>
              <button
                onClick={() => handleScreenshot('berechnungen-kurve', 'berechnungen-kurvenradius.png')}
                disabled={isProcessing}
                className="bg-transparent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 hover:shadow-sm transition-all duration-200 border border-white disabled:opacity-50 disabled:cursor-not-allowed"
                title="Als PNG herunterladen"
              >
                {isProcessing ? 'Lade...' : 'Download'}
              </button>
            </div>
          </div>
          <div className="p-4">
            <table className="w-full text-sm border border-primary-700 rounded-lg overflow-hidden shadow-md shadow-blue-200/50 border-b-2 border-r-2">
              <thead>
                <tr className="border-b-2 border-primary-700">
                  <th className="text-primary-700 font-semibold text-left py-3 px-2">Art</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Var</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2"><span className="text-black">Ein</span> / Ausgabe</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Formel</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Kurvenradius</td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">R</td>
                  <td className="py-2 px-2 text-center font-semibold">
                    {isCurveError()
                      ? <p className="text-red-500">ERROR</p>
                      : (radiusResult ? <p className="text-primary-700">{radiusResult}</p> : <p className="text-primary-700">-</p>)}
                  </td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">R = s²/8h + h/2</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Zentriwinkel</td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">θ</td>
                  <td className="py-2 px-2 text-center font-semibold">
                    {isCurveError()
                      ? <p className="text-red-500">ERROR</p>
                      : (zentriwinkelResult ? <p className="text-primary-700">{zentriwinkelResult}</p> : <p className="text-primary-700">-</p>)}
                  </td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">θ = 2×arcsin(s/2R)</td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Errechnete Bogenlänge</td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">b<sub>err</sub></td>
                  <td className="py-2 px-2 text-center font-semibold">
                    {isCurveError()
                      ? <p className="text-red-500">ERROR</p>
                      : (bogenlangeResult
                        ? <p className="text-primary-700">{bogenlangeResult}</p>
                        : (!isNaN(b) && b > 0
                          ? <p className="text-black">{b.toFixed(2).replace(".", ",")} m</p>
                          : <p className="text-primary-700">-</p>))}
                  </td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">b = R × θ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Curve Speed Input Section */}
        <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
          <div className="bg-gradient-to-r from-primary-700 to-primary-800 text-white px-6 py-3 card-header flex justify-between items-center">
            <h2 className="text-lg font-semibold">Kurvengrenzgeschwindigkeit</h2>
            <button
              onClick={handleResetSpeed}
              className="bg-white text-primary-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white"
              title="Alle Eingaben zurücksetzen"
            >
              Reset
            </button>
          </div>
          <div className="p-4">
            <table className="w-full text-sm border border-primary-700 rounded-lg overflow-hidden shadow-md shadow-blue-200/50 border-b-2 border-r-2">
              <thead>
                <tr className="border-b-2 border-primary-700">
                  <th className="text-primary-700 font-semibold text-left py-3 px-2">Art</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Var</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Eingabe</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Einheit</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Kurvenradius</td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">R</td>
                  <td className="py-2 px-2">
                    <div className="flex justify-center">
                      <StepperInput
                        value={R}
                        onChange={(value) => {
                          Rset(value);
                          if (!isNaN(value)) {
                            sessionStorage.setItem('sonst_R', value.toString());
                          } else {
                            sessionStorage.removeItem('sonst_R');
                          }
                        }}
                        step={1}
                        min={0}
                        max={10000}
                        placeholder="R in m"
                        onWheel={e => e.currentTarget.blur()}
                        className="w-32"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700"><Image unoptimized src={SVG.m} alt="m" className="inline-block max-w-full h-auto"></Image></td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Reibwert</td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">μ<sub>R</sub></td>
                  <td className="py-2 px-2">
                    <div className="flex justify-center">
                      <StepperInput
                        value={muR}
                        onChange={(value) => {
                          muRset(value);
                          if (!isNaN(value)) {
                            sessionStorage.setItem('sonst_muR', value.toString());
                          } else {
                            sessionStorage.removeItem('sonst_muR');
                          }
                        }}
                        step={0.01}
                        min={0}
                        max={2}
                        placeholder="μR"
                        onWheel={e => e.currentTarget.blur()}
                        className="w-28"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">-</td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Überhoehung</td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">ü</td>
                  <td className="py-2 px-2">
                    <div className="flex justify-center">
                      <StepperInput
                        value={ue}
                        onChange={(value) => {
                          ueset(value);
                          if (!isNaN(value)) {
                            sessionStorage.setItem('sonst_ue', value.toString());
                          } else {
                            sessionStorage.removeItem('sonst_ue');
                          }
                        }}
                        step={0.1}
                        min={0}
                        max={15}
                        placeholder="ü in %"
                        onWheel={e => e.currentTarget.blur()}
                        className="w-28"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700"><Image unoptimized src={SVG.percent} alt="percent" className="inline-block max-w-full h-auto"></Image></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Curve Speed Results Section */}
        <div id="berechnungen-geschwindigkeit" className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
          <div className="bg-gradient-to-r from-primary-700 to-primary-800 text-white px-6 py-3 card-header flex justify-between items-center">
            <h2 className="text-lg font-semibold">Kurvengrenzgeschwindigkeit Ergebnisse</h2>
            <div className="screenshot-buttons flex gap-2">
              <button
                onClick={() => handleClipboard('berechnungen-geschwindigkeit')}
                disabled={isProcessing}
                className="bg-white text-primary-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white disabled:opacity-50 disabled:cursor-not-allowed"
                title="In Zwischenablage kopieren"
              >
                {isProcessing ? 'Kopiere...' : 'Kopieren'}
              </button>
              <button
                onClick={() => handleScreenshot('berechnungen-geschwindigkeit', 'berechnungen-kurvengeschwindigkeit.png')}
                disabled={isProcessing}
                className="bg-transparent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 hover:shadow-sm transition-all duration-200 border border-white disabled:opacity-50 disabled:cursor-not-allowed"
                title="Als PNG herunterladen"
              >
                {isProcessing ? 'Lade...' : 'Download'}
              </button>
            </div>
          </div>
          <div className="p-4">
            <table className="w-full text-sm border border-primary-700 rounded-lg overflow-hidden shadow-md shadow-blue-200/50 border-b-2 border-r-2">
              <thead>
                <tr className="border-b-2 border-primary-700">
                  <th className="text-primary-700 font-semibold text-left py-3 px-2">Art</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Var</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2"><span className="text-black">Ein</span> / Ausgabe</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Formel</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Geschwindigkeit</td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">v</td>
                  <td className="py-2 px-2 text-center font-semibold">
                    {isSpeedError()
                      ? <p className="text-red-500">ERROR</p>
                      : (curveSpeedResult ? <p className="text-primary-700">{curveSpeedResult}</p> : <p className="text-primary-700">-</p>)}
                  </td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">v = 3.6×√((g×R×(μ<sub>R</sub>+e))/(1-μ<sub>R</sub>×e))</td>
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
