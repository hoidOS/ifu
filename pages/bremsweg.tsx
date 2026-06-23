import { useState, useEffect } from "react";
import Head from 'next/head'
import Image from 'next/image'
import SVG from '../assets/svg'
import * as util from '../components/utilStop'
import { useScreenshot } from '../hooks/useScreenshot'
import StepperInput from '../components/StepperInput'

interface InputInterface {
  vA: number,
  vE: number,
  tR: number,
  tS: number,
  am: number,
}

const data: InputInterface = {
  vA: 50,
  vE: 0,
  tR: 0.8,
  tS: 0.2,
  am: 7.5,
}

function Bremsweg() {

  const [input, setInput] = useState<InputInterface>(data)
  const { isProcessing, handleScreenshot, handleClipboard } = useScreenshot();

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


  const reaction: string = util.getReaction(input.vA, input.tR)
  const brakeDelay: string = util.getBrakeDelay(input.vA, input.tS, input.am)
  const fullSend: string = util.getFullSend(input.vA, input.am, input.tS)
  const brakeDistance: string = util.getBrakeDistance(input.vA, input.tS, input.vE, input.am)
  const brakeDuration: string = util.getBrakeDuration(input.vA, input.tS, input.am, input.vE)
  const fullDistance: string = util.getFullDistance(input.vA, input.vE, input.tR, input.tS, input.am)
  const fullTime: string = util.getFullTime(input.vA, input.vE, input.tR, input.tS, input.am)

  // Reset function to clear all input fields and restore defaults
  const handleReset = () => {
    setInput(data);
    
    // Clear from sessionStorage
    sessionStorage.removeItem('stop_vA');
    sessionStorage.removeItem('stop_vE');
    sessionStorage.removeItem('stop_tR');
    sessionStorage.removeItem('stop_tS');
    sessionStorage.removeItem('stop_am');
  };

  return (
    <div>

      <Head>
        <title>PPCAVS | Anhaltevorgang</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width" />
      </Head>

      <div className="grid gap-6 mx-auto max-w-screen-2xl px-4 py-6 md:grid-cols-2">

        <div className="calculator-card no-print">
          <div className="calculator-card-header">
            <h2 className="text-lg font-semibold">Anhaltevorgang</h2>
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
                  <td className="py-2 px-2 font-medium text-gray-700">Anfangsgeschwindigkeit</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.vA} alt="vA" className="inline-block h-auto w-auto max-w-full"></Image></td>
                  <td className="py-2 px-2">
                    <div className="flex justify-center">
                      <StepperInput
                        value={input.vA}
                        onChange={(value) => {
                          setInput({ ...input, vA: value });
                          if (!isNaN(value)) {
                            sessionStorage.setItem('stop_vA', value.toString());
                          } else {
                            sessionStorage.removeItem('stop_vA');
                          }
                        }}
                        step={1}
                        min={0}
                        max={300}
                        placeholder="v in km/h"
                        className="w-32"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.kmh} alt="kmh" className="inline-block h-auto w-auto max-w-full"></Image></td>
                </tr>
                <tr className="calculator-row">
                  <td className="py-2 px-2 font-medium text-gray-700">Endgeschwindigkeit</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.vE} alt="vE" className="inline-block h-auto w-auto max-w-full"></Image></td>
                  <td className="py-2 px-2">
                    <div className="flex justify-center">
                      <StepperInput
                        value={input.vE}
                        onChange={(value) => {
                          setInput({ ...input, vE: value });
                          if (!isNaN(value)) {
                            sessionStorage.setItem('stop_vE', value.toString());
                          } else {
                            sessionStorage.removeItem('stop_vE');
                          }
                        }}
                        step={1}
                        min={0}
                        max={300}
                        placeholder="v in km/h"
                        className="w-32"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.kmh} alt="kmh" className="inline-block h-auto w-auto max-w-full"></Image></td>
                </tr>
                <tr className="calculator-row">
                  <td className="py-2 px-2 font-medium text-gray-700">Reaktionsdauer</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.tR} alt="tR" className="inline-block h-auto w-auto max-w-full"></Image></td>
                  <td className="py-2 px-2">
                    <div className="flex justify-center">
                      <StepperInput
                        value={input.tR}
                        onChange={(value) => {
                          setInput({ ...input, tR: value });
                          if (!isNaN(value)) {
                            sessionStorage.setItem('stop_tR', value.toString());
                          } else {
                            sessionStorage.removeItem('stop_tR');
                          }
                        }}
                        step={0.1}
                        min={0}
                        max={5}
                        placeholder="s in Sekunden"
                        className="w-28"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.s} alt="s" className="inline-block h-auto w-auto max-w-full"></Image></td>
                </tr>
                <tr className="calculator-row">
                  <td className="py-2 px-2 font-medium text-gray-700">Bremsschwelldauer</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.tS} alt="tS" className="inline-block h-auto w-auto max-w-full"></Image></td>
                  <td className="py-2 px-2">
                    <div className="flex justify-center">
                      <StepperInput
                        value={input.tS}
                        onChange={(value) => {
                          setInput({ ...input, tS: value });
                          if (!isNaN(value)) {
                            sessionStorage.setItem('stop_tS', value.toString());
                          } else {
                            sessionStorage.removeItem('stop_tS');
                          }
                        }}
                        step={0.1}
                        min={0}
                        max={2}
                        placeholder="s in Sekunden"
                        className="w-28"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.s} alt="s" className="inline-block h-auto w-auto max-w-full"></Image></td>
                </tr>
                <tr className="calculator-row-last">
                  <td className="py-2 px-2 font-medium text-gray-700">Mittlere Verzögerung</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.am} alt="am" className="inline-block h-auto w-auto max-w-full"></Image></td>
                  <td className="py-2 px-2">
                    <div className="flex justify-center">
                      <StepperInput
                        value={input.am}
                        onChange={(value) => {
                          setInput({ ...input, am: value });
                          if (!isNaN(value)) {
                            sessionStorage.setItem('stop_am', value.toString());
                          } else {
                            sessionStorage.removeItem('stop_am');
                          }
                        }}
                        step={0.5}
                        min={0}
                        max={20}
                        placeholder="a in m/s²"
                        className="w-32"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.ms2} alt="ms2" className="inline-block h-auto w-auto max-w-full"></Image></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div id="results-print" className="calculator-card">
          <div className="calculator-card-header">
            <h2 className="text-lg font-semibold">Anhaltevorgang</h2>
            <div className="flex gap-2">
              <button
                id="clipboard-button"
                onClick={() => handleClipboard('results-print')}
                disabled={isProcessing}
                className="calculator-header-button disabled:opacity-50 disabled:cursor-not-allowed"
                title="In Zwischenablage kopieren"
              >
                {isProcessing ? 'Kopiere...' : 'Kopieren'}
              </button>
              <button
                id="screenshot-button"
                onClick={() => handleScreenshot('results-print', 'ergebnisse-anhaltevorgang.png')}
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
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Eingabe</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Bemerkungen</th>
                </tr>
              </thead>
              <tbody>
                <tr className="calculator-row">
                  <td className="py-2 px-2 font-medium text-gray-700">Anfangsgeschwindigkeit</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.vA} alt="vA" className="inline-block h-auto w-auto max-w-full"></Image></td>
                  <td className="py-2 px-2 text-center font-semibold text-primary-700">{input.vA.toString().replace(".", ",")} km/h</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.vAvE} alt="vAvE" className="inline-block h-auto w-auto max-w-full"></Image></td>
                </tr>
                <tr className="calculator-row">
                  <td className="py-2 px-2 font-medium text-gray-700">Endgeschwindigkeit</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.vE} alt="vE" className="inline-block h-auto w-auto max-w-full"></Image></td>
                  <td className="py-2 px-2 text-center font-semibold text-primary-700">{input.vE.toString().replace(".", ",")} km/h</td>
                  <td className="py-2 px-2 text-center text-sm text-gray-600">0 für Bremsung bis zum Stillstand</td>
                </tr>
                <tr className="calculator-row">
                  <td className="py-2 px-2 font-medium text-gray-700">Reaktionsdauer</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.tR} alt="tR" className="inline-block h-auto w-auto max-w-full"></Image></td>
                  <td className="py-2 px-2 text-center font-semibold text-primary-700">{input.tR.toString().replace(".", ",")} s</td>
                  <td className="py-2 px-2 text-center text-sm text-gray-600">Reaktionspunkt bis Bremspunkt</td>
                </tr>
                <tr className="calculator-row">
                  <td className="py-2 px-2 font-medium text-gray-700">Bremsschwelldauer</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.tS} alt="tS" className="inline-block h-auto w-auto max-w-full"></Image></td>
                  <td className="py-2 px-2 text-center font-semibold text-primary-700">{input.tS.toString().replace(".", ",")} s</td>
                  <td className="py-2 px-2 text-center text-sm text-gray-600">Fahrzeugabhängig</td>
                </tr>
                <tr className="calculator-row">
                  <td className="py-2 px-2 font-medium text-gray-700">Mittlere Verzögerung</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.am} alt="am" className="inline-block h-auto w-auto max-w-full"></Image></td>
                  <td className="py-2 px-2 text-center font-semibold text-primary-700">{input.am.toString().replace(".", ",")} m/s²</td>
                  <td className="py-2 px-2 text-center text-sm text-gray-600">Abhängig von der Reibpaarung</td>
                </tr>
                <tr className="bg-slate-50 border-y-2 border-primary-700">
                  <th className="text-primary-700 font-semibold text-left py-3 px-2">Art</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Var</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Ausgabe</th>
                  <th className="text-primary-700 font-semibold text-center py-3 px-2">Formel</th>
                </tr>
                <tr className="calculator-row">
                  <td className="py-2 px-2 font-medium text-gray-700">Reaktionsstrecke</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.sR} alt="sR" className="inline-block h-auto w-auto max-w-full"></Image></td>
                  <td className="py-2 px-2 text-center font-semibold text-primary-700">{reaction}</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.sRF} alt="sRF" className="inline-block h-auto w-auto max-w-full"></Image></td>
                </tr>
                <tr className="calculator-row">
                  <td className="py-2 px-2 font-medium text-gray-700">Schwellstrecke</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.sS} alt="sS" className="inline-block h-auto w-auto max-w-full"></Image></td>
                  <td className="py-2 px-2 text-center font-semibold text-primary-700">{brakeDelay}</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.sSF} alt="sSF" loading="eager" className="inline-block h-auto w-auto max-w-full"></Image></td>
                </tr>
                <tr className="calculator-row">
                  <td className="py-2 px-2 font-medium text-gray-700">Geschw. Vollverzögerung</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.vV} alt="vV" className="inline-block h-auto w-auto max-w-full"></Image></td>
                  <td className="py-2 px-2 text-center font-semibold text-primary-700">{fullSend}</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.vVF} alt="vVF" className="inline-block h-auto w-auto max-w-full"></Image></td>
                </tr>
                <tr className="calculator-row">
                  <td className="py-2 px-2 font-medium text-gray-700">Bremsstrecke</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.sB} alt="sB" className="inline-block h-auto w-auto max-w-full"></Image></td>
                  <td className="py-2 px-2 text-center font-semibold text-primary-700">{brakeDistance}</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.sBF} alt="sBF" className="inline-block h-auto w-auto max-w-full"></Image></td>
                </tr>
                <tr className="calculator-row">
                  <td className="py-2 px-2 font-medium text-gray-700">Bremsdauer</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.tB} alt="tB" className="inline-block h-auto w-auto max-w-full"></Image></td>
                  <td className="py-2 px-2 text-center font-semibold text-primary-700">{brakeDuration}</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.tBF} alt="tBF" className="inline-block h-auto w-auto max-w-full"></Image></td>
                </tr>
                <tr className="calculator-row">
                  <td className="py-2 px-2 font-medium text-gray-700">Gesamtstrecke von <Image unoptimized src={SVG.vA} alt="vA" className="inline-block h-auto w-auto max-w-full"></Image> bis <Image unoptimized src={SVG.vE} alt="vE" className="inline-block h-auto w-auto max-w-full"></Image></td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.sges} alt="sges" className="inline-block h-auto w-auto max-w-full"></Image></td>
                  <td className="py-2 px-2 text-center font-semibold text-primary-700">{fullDistance}</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.sgesF} alt="sgesF" className="inline-block h-auto w-auto max-w-full"></Image></td>
                </tr>
                <tr className="calculator-row-last">
                  <td className="py-2 px-2 font-medium text-gray-700">Gesamtdauer von <Image unoptimized src={SVG.vA} alt="vA" className="inline-block h-auto w-auto max-w-full"></Image> bis <Image unoptimized src={SVG.vE} alt="vE" className="inline-block h-auto w-auto max-w-full"></Image></td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.tges} alt="tges" className="inline-block h-auto w-auto max-w-full"></Image></td>
                  <td className="py-2 px-2 text-center font-semibold text-primary-700">{fullTime}</td>
                  <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.tgesF} alt="tgesF" className="inline-block h-auto w-auto max-w-full"></Image></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Bremsweg;
