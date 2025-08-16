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

  // Curve radius calculation states
  const [h, hset] = useState<number>(NaN) // Segmenthöhe
  const [s, sset] = useState<number>(NaN) // Segmentlänge  
  const [b, bset] = useState<number>(NaN) // Bogenlänge

  // Curve speed calculation states
  const [R, Rset] = useState<number>(NaN) // Kurvenradius
  const [muR, muRset] = useState<number>(NaN) // Reibwert
  const [ue, ueset] = useState<number>(NaN) // Überhoehung

  // Vehicle data states
  const [amtlKennzeichen, amtlKennzeichenSet] = useState<string>('')
  const [fahrzeugart, fahrzeugartSet] = useState<string>('')
  const [fabrikat, fabrikatSet] = useState<string>('')
  const [typ, typSet] = useState<string>('')
  const [fahrzeugIdent, fahrzeugIdentSet] = useState<string>('')
  const [erstzulassung, erstzulassungSet] = useState<string>('')
  const [laufleistung, laufleistungSet] = useState<number>(NaN)
  const [reifendimension, reifendimensionSet] = useState<string>('')
  const [leistung, leistungSet] = useState<number>(NaN)
  const [hubraum, hubraumSet] = useState<number>(NaN)
  const [leermasse, leermasseSet] = useState<number>(NaN)
  const [zulGesamtmasse, zulGesamtmasseSet] = useState<number>(NaN)

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

    // Vehicle data
    const savedAmtlKennzeichen = sessionStorage.getItem('sonst_amtlKennzeichen');
    const savedFahrzeugart = sessionStorage.getItem('sonst_fahrzeugart');
    const savedFabrikat = sessionStorage.getItem('sonst_fabrikat');
    const savedTyp = sessionStorage.getItem('sonst_typ');
    const savedFahrzeugIdent = sessionStorage.getItem('sonst_fahrzeugIdent');
    const savedErstzulassung = sessionStorage.getItem('sonst_erstzulassung');
    const savedLaufleistung = sessionStorage.getItem('sonst_laufleistung');
    const savedReifendimension = sessionStorage.getItem('sonst_reifendimension');
    const savedLeistung = sessionStorage.getItem('sonst_leistung');
    const savedHubraum = sessionStorage.getItem('sonst_hubraum');
    const savedLeermasse = sessionStorage.getItem('sonst_leermasse');
    const savedZulGesamtmasse = sessionStorage.getItem('sonst_zulGesamtmasse');

    if (savedP && !isNaN(parseFloat(savedP))) pset(parseFloat(savedP));
    if (savedAlpha && !isNaN(parseFloat(savedAlpha))) alphaset(parseFloat(savedAlpha));
    if (savedH && !isNaN(parseFloat(savedH))) hset(parseFloat(savedH));
    if (savedS && !isNaN(parseFloat(savedS))) sset(parseFloat(savedS));
    if (savedB && !isNaN(parseFloat(savedB))) bset(parseFloat(savedB));
    if (savedR && !isNaN(parseFloat(savedR))) Rset(parseFloat(savedR));
    if (savedMuR && !isNaN(parseFloat(savedMuR))) muRset(parseFloat(savedMuR));
    if (savedUe && !isNaN(parseFloat(savedUe))) ueset(parseFloat(savedUe));

    // Vehicle data loading
    if (savedAmtlKennzeichen) amtlKennzeichenSet(savedAmtlKennzeichen);
    if (savedFahrzeugart) fahrzeugartSet(savedFahrzeugart);
    if (savedFabrikat) fabrikatSet(savedFabrikat);
    if (savedTyp) typSet(savedTyp);
    if (savedFahrzeugIdent) fahrzeugIdentSet(savedFahrzeugIdent);
    if (savedErstzulassung) erstzulassungSet(savedErstzulassung);
    if (savedLaufleistung && !isNaN(parseFloat(savedLaufleistung))) laufleistungSet(parseFloat(savedLaufleistung));
    if (savedReifendimension) reifendimensionSet(savedReifendimension);
    if (savedLeistung && !isNaN(parseFloat(savedLeistung))) leistungSet(parseFloat(savedLeistung));
    if (savedHubraum && !isNaN(parseFloat(savedHubraum))) hubraumSet(parseFloat(savedHubraum));
    if (savedLeermasse && !isNaN(parseFloat(savedLeermasse))) leermasseSet(parseFloat(savedLeermasse));
    if (savedZulGesamtmasse && !isNaN(parseFloat(savedZulGesamtmasse))) zulGesamtmasseSet(parseFloat(savedZulGesamtmasse));
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

  // Reset function for vehicle data
  const handleResetVehicle = () => {
    amtlKennzeichenSet('');
    fahrzeugartSet('');
    fabrikatSet('');
    typSet('');
    fahrzeugIdentSet('');
    erstzulassungSet('');
    laufleistungSet(NaN);
    reifendimensionSet('');
    leistungSet(NaN);
    hubraumSet(NaN);
    leermasseSet(NaN);
    zulGesamtmasseSet(NaN);

    // Clear from sessionStorage
    sessionStorage.removeItem('sonst_amtlKennzeichen');
    sessionStorage.removeItem('sonst_fahrzeugart');
    sessionStorage.removeItem('sonst_fabrikat');
    sessionStorage.removeItem('sonst_typ');
    sessionStorage.removeItem('sonst_fahrzeugIdent');
    sessionStorage.removeItem('sonst_erstzulassung');
    sessionStorage.removeItem('sonst_laufleistung');
    sessionStorage.removeItem('sonst_reifendimension');
    sessionStorage.removeItem('sonst_leistung');
    sessionStorage.removeItem('sonst_hubraum');
    sessionStorage.removeItem('sonst_leermasse');
    sessionStorage.removeItem('sonst_zulGesamtmasse');
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

        {/* Curve Radius Input Section */}
        <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
          <div className="bg-gradient-to-r from-[#0059a9] to-[#003d7a] text-white px-6 py-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Kurvenradius</h2>
            <button
              onClick={handleResetCurve}
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
                  <td className="py-2 px-2 font-medium text-gray-700">Segmenthöhe</td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">h</td>
                  <td className="py-2 px-2">
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
                    />
                  </td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">m</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Segmentlänge</td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">s</td>
                  <td className="py-2 px-2">
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
                    />
                  </td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">m</td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Bogenlänge</td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">b</td>
                  <td className="py-2 px-2">
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
                    />
                  </td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">m</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Curve Radius Results Section */}
        <div id="berechnungen-kurve" className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
          <div className="bg-gradient-to-r from-[#0059a9] to-[#003d7a] text-white px-6 py-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Kurvenradius Ergebnisse</h2>
            <div className="screenshot-buttons flex gap-2">
              <button
                onClick={() => handleClipboard('berechnungen-kurve')}
                disabled={isProcessing}
                className="bg-white text-[#0059a9] px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <td className="py-2 px-2 font-medium text-gray-700">Kurvenradius</td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">R</td>
                  <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">
                    {isCurveError() ? <p className="text-red-500">ERROR</p> : (calculateRadius() || <p className="text-gray-400">-</p>)}
                  </td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">R = s²/8h + h/2</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Zentriwinkel</td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">θ</td>
                  <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">
                    {isCurveError() ? <p className="text-red-500">ERROR</p> : (calculateZentriwinkel() || <p className="text-gray-400">-</p>)}
                  </td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">θ = 2×arcsin(s/2R)</td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Errechnete Bogenlänge</td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">b<sub>err</sub></td>
                  <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">
                    {isCurveError() ? <p className="text-red-500">ERROR</p> : (calculateBogenlange() || <p className="text-gray-400">-</p>)}
                  </td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">b = R × θ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Curve Speed Input Section */}
        <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
          <div className="bg-gradient-to-r from-[#0059a9] to-[#003d7a] text-white px-6 py-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Kurvengrenzgeschwindigkeit</h2>
            <button
              onClick={handleResetSpeed}
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
                  <td className="py-2 px-2 font-medium text-gray-700">Kurvenradius</td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">R</td>
                  <td className="py-2 px-2">
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
                    />
                  </td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">m</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Reibwert</td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">μ<sub>R</sub></td>
                  <td className="py-2 px-2">
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
                    />
                  </td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">-</td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Überhoehung</td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">ü</td>
                  <td className="py-2 px-2">
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
                    />
                  </td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Curve Speed Results Section */}
        <div id="berechnungen-geschwindigkeit" className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
          <div className="bg-gradient-to-r from-[#0059a9] to-[#003d7a] text-white px-6 py-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Kurvengrenzgeschwindigkeit Ergebnisse</h2>
            <div className="screenshot-buttons flex gap-2">
              <button
                onClick={() => handleClipboard('berechnungen-geschwindigkeit')}
                disabled={isProcessing}
                className="bg-white text-[#0059a9] px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-2 font-medium text-gray-700">Geschwindigkeit</td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">v</td>
                  <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">
                    {isSpeedError() ? <p className="text-red-500">ERROR</p> : (calculateCurveSpeed() || <p className="text-gray-400">-</p>)}
                  </td>
                  <td className="py-2 px-2 text-center font-medium text-gray-700">v = 3.6×√((g×R×(μ<sub>R</sub>+e))/(1-μ<sub>R</sub>×e))</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Vehicle Data Input Section */}
        <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
          <div className="bg-gradient-to-r from-[#0059a9] to-[#003d7a] text-white px-6 py-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Fahrzeugdaten</h2>
            <button
              onClick={handleResetVehicle}
              className="bg-white text-[#0059a9] px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white"
              title="Alle Eingaben zurücksetzen"
            >
              Reset
            </button>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">amtl. Kennzeichen:</label>
                  <input
                    type="text"
                    value={amtlKennzeichen}
                    onChange={(e) => {
                      amtlKennzeichenSet(e.target.value);
                      sessionStorage.setItem('sonst_amtlKennzeichen', e.target.value);
                    }}
                    className="w-full max-w-none px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Kennzeichen eingeben"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fahrzeugart:</label>
                  <input
                    type="text"
                    value={fahrzeugart}
                    onChange={(e) => {
                      fahrzeugartSet(e.target.value);
                      sessionStorage.setItem('sonst_fahrzeugart', e.target.value);
                    }}
                    className="w-full max-w-none px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Fahrzeugart eingeben"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fabrikat:</label>
                  <input
                    type="text"
                    value={fabrikat}
                    onChange={(e) => {
                      fabrikatSet(e.target.value);
                      sessionStorage.setItem('sonst_fabrikat', e.target.value);
                    }}
                    className="w-full max-w-none px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Fabrikat eingeben"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Typ:</label>
                  <input
                    type="text"
                    value={typ}
                    onChange={(e) => {
                      typSet(e.target.value);
                      sessionStorage.setItem('sonst_typ', e.target.value);
                    }}
                    className="w-full max-w-none px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Typ eingeben"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fahrzeug-Ident-Nummer:</label>
                  <input
                    type="text"
                    value={fahrzeugIdent}
                    onChange={(e) => {
                      fahrzeugIdentSet(e.target.value);
                      sessionStorage.setItem('sonst_fahrzeugIdent', e.target.value);
                    }}
                    className="w-full max-w-none px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="FIN eingeben"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Erstzulassung:</label>
                  <input
                    type="text"
                    value={erstzulassung}
                    onChange={(e) => {
                      erstzulassungSet(e.target.value);
                      sessionStorage.setItem('sonst_erstzulassung', e.target.value);
                    }}
                    className="w-full max-w-none px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Erstzulassung eingeben"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Laufleistung (km):</label>
                  <input
                    type="number"
                    value={isNaN(laufleistung) ? '' : laufleistung}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      laufleistungSet(isNaN(value) ? NaN : value);
                      if (!isNaN(value)) {
                        sessionStorage.setItem('sonst_laufleistung', value.toString());
                      } else {
                        sessionStorage.removeItem('sonst_laufleistung');
                      }
                    }}
                    className="w-full max-w-none px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Laufleistung in km"
                    min="0"
                    max="1000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reifendimension:</label>
                  <input
                    type="text"
                    value={reifendimension}
                    onChange={(e) => {
                      reifendimensionSet(e.target.value);
                      sessionStorage.setItem('sonst_reifendimension', e.target.value);
                    }}
                    className="w-full max-w-none px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. 225/50R17"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Leistung (kW):</label>
                  <input
                    type="number"
                    value={isNaN(leistung) ? '' : leistung}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      leistungSet(isNaN(value) ? NaN : value);
                      if (!isNaN(value)) {
                        sessionStorage.setItem('sonst_leistung', value.toString());
                      } else {
                        sessionStorage.removeItem('sonst_leistung');
                      }
                    }}
                    className="w-full max-w-none px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Leistung in kW"
                    min="0"
                    max="1000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hubraum (cm³):</label>
                  <input
                    type="number"
                    value={isNaN(hubraum) ? '' : hubraum}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      hubraumSet(isNaN(value) ? NaN : value);
                      if (!isNaN(value)) {
                        sessionStorage.setItem('sonst_hubraum', value.toString());
                      } else {
                        sessionStorage.removeItem('sonst_hubraum');
                      }
                    }}
                    className="w-full max-w-none px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Hubraum in cm³"
                    min="0"
                    max="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Leermasse inkl. Fahrer (kg):</label>
                  <input
                    type="number"
                    value={isNaN(leermasse) ? '' : leermasse}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      leermasseSet(isNaN(value) ? NaN : value);
                      if (!isNaN(value)) {
                        sessionStorage.setItem('sonst_leermasse', value.toString());
                      } else {
                        sessionStorage.removeItem('sonst_leermasse');
                      }
                    }}
                    className="w-full max-w-none px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Leermasse in kg"
                    min="0"
                    max="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zul. Gesamtmasse (kg):</label>
                  <input
                    type="number"
                    value={isNaN(zulGesamtmasse) ? '' : zulGesamtmasse}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      zulGesamtmasseSet(isNaN(value) ? NaN : value);
                      if (!isNaN(value)) {
                        sessionStorage.setItem('sonst_zulGesamtmasse', value.toString());
                      } else {
                        sessionStorage.removeItem('sonst_zulGesamtmasse');
                      }
                    }}
                    className="w-full max-w-none px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Gesamtmasse in kg"
                    min="0"
                    max="10000"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Data Output Section */}
        <div id="berechnungen-fahrzeug" className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
          <div className="bg-gradient-to-r from-[#0059a9] to-[#003d7a] text-white px-6 py-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Fahrzeugdaten Übersicht</h2>
            <div className="screenshot-buttons flex gap-2">
              <button
                onClick={() => handleClipboard('fahrzeugdaten-table-container')}
                disabled={isProcessing}
                className="bg-white text-[#0059a9] px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white disabled:opacity-50 disabled:cursor-not-allowed"
                title="In Zwischenablage kopieren"
              >
                {isProcessing ? 'Kopiere...' : 'Kopieren'}
              </button>
              <button
                onClick={() => handleScreenshot('fahrzeugdaten-table-container', 'fahrzeugdaten.png')}
                disabled={isProcessing}
                className="bg-transparent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 hover:shadow-sm transition-all duration-200 border border-white disabled:opacity-50 disabled:cursor-not-allowed"
                title="Als PNG herunterladen"
              >
                {isProcessing ? 'Lade...' : 'Download'}
              </button>
            </div>
          </div>
          <div id="fahrzeugdaten-table-container" className="p-4">
            <table className="w-full text-base border border-[#0059a9] rounded-lg overflow-hidden shadow-md shadow-blue-200/50 border-b-2 border-r-2">
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-700">amtl. Kennzeichen:</td>
                  <td className="py-3 px-4 text-right font-semibold text-[#0059a9]">{amtlKennzeichen || <span className="text-gray-400">-</span>}</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-700">Fahrzeugart:</td>
                  <td className="py-3 px-4 text-right font-semibold text-[#0059a9]">{fahrzeugart || <span className="text-gray-400">-</span>}</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-700">Fabrikat:</td>
                  <td className="py-3 px-4 text-right font-semibold text-[#0059a9]">{fabrikat || <span className="text-gray-400">-</span>}</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-700">Typ:</td>
                  <td className="py-3 px-4 text-right font-semibold text-[#0059a9]">{typ || <span className="text-gray-400">-</span>}</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-700">Fahrzeug-Ident-Nummer:</td>
                  <td className="py-3 px-4 text-right font-semibold text-[#0059a9]">{fahrzeugIdent || <span className="text-gray-400">-</span>}</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-700">Erstzulassung:</td>
                  <td className="py-3 px-4 text-right font-semibold text-[#0059a9]">{erstzulassung || <span className="text-gray-400">-</span>}</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-700">Laufleistung:</td>
                  <td className="py-3 px-4 text-right font-semibold text-[#0059a9]">
                    {!isNaN(laufleistung) ? `${laufleistung.toLocaleString('de-DE')} km` : <span className="text-gray-400">-</span>}
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-700">Reifendimension:</td>
                  <td className="py-3 px-4 text-right font-semibold text-[#0059a9]">{reifendimension || <span className="text-gray-400">-</span>}</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-700">Leistung:</td>
                  <td className="py-3 px-4 text-right font-semibold text-[#0059a9]">
                    {!isNaN(leistung) ? `${leistung.toFixed(0)} kW` : <span className="text-gray-400">-</span>}
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-700">Hubraum:</td>
                  <td className="py-3 px-4 text-right font-semibold text-[#0059a9]">
                    {!isNaN(hubraum) ? `${hubraum.toFixed(0)} cm³` : <span className="text-gray-400">-</span>}
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-700">Leermasse inkl. Fahrer:</td>
                  <td className="py-3 px-4 text-right font-semibold text-[#0059a9]">
                    {!isNaN(leermasse) ? `${leermasse.toFixed(0)} kg` : <span className="text-gray-400">-</span>}
                  </td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-700">Zul. Gesamtmasse:</td>
                  <td className="py-3 px-4 text-right font-semibold text-[#0059a9]">
                    {!isNaN(zulGesamtmasse) ? `${zulGesamtmasse.toFixed(0)} kg` : <span className="text-gray-400">-</span>}
                  </td>
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
