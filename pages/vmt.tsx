
import { useState, useEffect } from "react";
import Image from 'next/image'
import Head from 'next/head'
import SVG from '../assets/svg'
import { useScreenshot } from '../hooks/useScreenshot'
import StepperInput from '../components/StepperInput'

function VMT() {
    const [s, sSet] = useState<number>(NaN)
    const [sR, sRSet] = useState<number>(NaN)

    const { isProcessing, handleScreenshot, handleClipboard } = useScreenshot();

    const sIsSet = !isNaN(s)
    const sRIsSet = !isNaN(sR)

    // Load saved values from sessionStorage on component mount
    useEffect(() => {
        const savedS = sessionStorage.getItem('vmt_s');
        const savedSR = sessionStorage.getItem('vmt_sR');
        
        if (savedS && !isNaN(parseFloat(savedS))) sSet(parseFloat(savedS));
        if (savedSR && !isNaN(parseFloat(savedSR))) sRSet(parseFloat(savedSR));
    }, []);

    // Reset function to clear all input fields and sessionStorage
    const handleResetESO = () => {
        sSet(NaN);
        sessionStorage.removeItem('vmt_s');
    };

    const handleResetRiegl = () => {
        sRSet(NaN);
        sessionStorage.removeItem('vmt_sR');
    };
    // const [sMax, sMaxSet] = useState<number>(NaN)
    // const [dMax, dMaxSet] = useState<number>(NaN)


    const d = () => {
        return ((0.45 * s) / 18) + 0.05
    }

    const solveMax = (): string | boolean => {
        if (s >= 0) {
            return d().toFixed(3).replace(".", ",")
        } else {
            return false
        }
    }

    const solveRiegl = (): string | boolean => {
        return false

    }

    const esoDiameter = solveMax()
    const rieglPointer1 = sRIsSet ? (sR * 0.001).toFixed(3).replace(".", ",") : null
    const rieglBeam3 = sRIsSet ? (sR * 0.003).toFixed(3).replace(".", ",") : null
    const rieglTarget5 = sRIsSet ? (sR * 0.005).toFixed(3).replace(".", ",") : null

    return (

        <div className="grid gap-6 mx-auto max-w-7xl px-4 py-8 lg:grid-cols-2">
            <Head>
                <title>VMT | ESO</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width" />
            </Head>


            <div className="calculator-card">
                <div className="calculator-card-header">
                    <h2 className="text-lg font-semibold">ESO</h2>
                    <button 
                        onClick={handleResetESO}
                        className="calculator-header-button"
                        title="ESO Eingaben zurücksetzen"
                    >
                        Reset
                    </button>
                </div>
                <div className="p-4">
                <table className="calculator-table">
                    <thead>
                        <tr className="border-b-2 border-primary-700">
                            <th className="text-primary-700 font-semibold text-left py-3 px-2">ESO Strahlaufweitung</th>
                            <th className="text-primary-700 font-semibold text-center py-3 px-2"><span className="text-slate-900">Ein</span><span className="text-slate-400"> / </span><span className="text-primary-700">Ausgabe</span></th>
                            <th className="text-primary-700 font-semibold text-center py-3 px-2">Einheit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="calculator-row-last">
                            <td className="py-2 px-2 font-medium text-gray-700">Messentfernung</td>
                            <td className="py-2 px-2">
                                <div className="flex justify-center">
                                    <StepperInput
                                        value={s}
                                        onChange={(value) => {
                                            sSet(value);
                                            if (!isNaN(value)) {
                                                sessionStorage.setItem('vmt_s', value.toString());
                                            } else {
                                                sessionStorage.removeItem('vmt_s');
                                            }
                                        }}
                                        step={1}
                                        min={0}
                                        max={1000}
                                        placeholder="m"
                                        onWheel={e => e.currentTarget.blur()}
                                        className="w-32"
                                    />
                                </div>
                            </td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m" className="inline-block h-auto w-auto max-w-full"></Image></td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>

            <div id="eso-ergebnisse" className="calculator-card">
                <div className="calculator-card-header">
                    <h2 className="text-lg font-semibold">ESO Ergebnisse</h2>
                    <div data-screenshot-ignore="true" className="screenshot-buttons flex gap-2">
                        <button 
                            onClick={() => handleClipboard('eso-ergebnisse')}
                            disabled={isProcessing}
                            className="calculator-header-button disabled:opacity-50 disabled:cursor-not-allowed"
                            title="In Zwischenablage kopieren"
                        >
                            {isProcessing ? 'Kopiere...' : 'Kopieren'}
                        </button>
                        <button 
                            onClick={() => handleScreenshot('eso-ergebnisse', 'eso-ergebnisse.png')}
                            disabled={isProcessing}
                            className="calculator-header-button-outline disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Als PNG herunterladen"
                        >
                            {isProcessing ? 'Lade...' : 'Download'}
                        </button>
                    </div>
                </div>
                <div className="p-4">
                <table className="calculator-table">
                    <thead>
                        <tr className="border-b-2 border-primary-700">
                            <th className="text-primary-700 font-semibold text-left py-3 px-2">ESO Strahlaufweitung</th>
                            <th className="text-primary-700 font-semibold text-center py-3 px-2"><span className="text-slate-900">Ein</span><span className="text-slate-400"> / </span><span className="text-primary-700">Ausgabe</span></th>
                            <th className="text-primary-700 font-semibold text-center py-3 px-2">Einheit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="calculator-row">
                            <td className="py-2 px-2 font-medium text-gray-700">Messentfernung</td>
                            <td className="py-2 px-2 text-center font-semibold">
                                {sIsSet
                                    ? <p className="text-black">{s.toFixed(1).replace(".", ",")}</p>
                                    : <p className="text-primary-700">-</p>
                                }
                            </td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m" className="inline-block h-auto w-auto max-w-full"></Image></td>
                        </tr>
                        <tr className="calculator-row-last">
                            <td className="py-2 px-2 font-medium text-gray-700">Durchmesser</td>
                            <td className="py-2 px-2 text-center font-semibold text-primary-700">
                                {esoDiameter
                                    ? <p>{esoDiameter}</p>
                                    : <p>-</p>
                                }
                            </td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m" className="inline-block h-auto w-auto max-w-full"></Image></td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>

            <div className="calculator-card">
                <div className="calculator-card-header">
                    <h2 className="text-lg font-semibold">Riegl</h2>
                    <button 
                        onClick={handleResetRiegl}
                        className="calculator-header-button"
                        title="Riegl Eingaben zurücksetzen"
                    >
                        Reset
                    </button>
                </div>
                <div className="p-4">
                <table className="calculator-table">
                    <thead>
                        <tr className="border-b-2 border-primary-700">
                            <th className="text-primary-700 font-semibold text-left py-3 px-2">Riegl Strahlaufweitung</th>
                            <th className="text-primary-700 font-semibold text-center py-3 px-2"><span className="text-slate-900">Ein</span><span className="text-slate-400"> / </span><span className="text-primary-700">Ausgabe</span></th>
                            <th className="text-primary-700 font-semibold text-center py-3 px-2">Einheit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="calculator-row-last">
                            <td className="py-2 px-2 font-medium text-gray-700">Messentfernung</td>
                            <td className="py-2 px-2">
                                <div className="flex justify-center">
                                    <StepperInput
                                        value={sR}
                                        onChange={(value) => {
                                            sRSet(value);
                                            if (!isNaN(value)) {
                                                sessionStorage.setItem('vmt_sR', value.toString());
                                            } else {
                                                sessionStorage.removeItem('vmt_sR');
                                            }
                                        }}
                                        step={1}
                                        min={0}
                                        max={1000}
                                        placeholder="m"
                                        onWheel={e => e.currentTarget.blur()}
                                        className="w-32"
                                    />
                                </div>
                            </td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m" className="inline-block h-auto w-auto max-w-full"></Image></td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>

            <div id="riegl-ergebnisse" className="calculator-card">
                <div className="calculator-card-header">
                    <h2 className="text-lg font-semibold">Riegl Ergebnisse</h2>
                    <div data-screenshot-ignore="true" className="screenshot-buttons flex gap-2">
                        <button 
                            onClick={() => handleClipboard('riegl-ergebnisse')}
                            disabled={isProcessing}
                            className="calculator-header-button disabled:opacity-50 disabled:cursor-not-allowed"
                            title="In Zwischenablage kopieren"
                        >
                            {isProcessing ? 'Kopiere...' : 'Kopieren'}
                        </button>
                        <button 
                            onClick={() => handleScreenshot('riegl-ergebnisse', 'riegl-ergebnisse.png')}
                            disabled={isProcessing}
                            className="calculator-header-button-outline disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Als PNG herunterladen"
                        >
                            {isProcessing ? 'Lade...' : 'Download'}
                        </button>
                    </div>
                </div>
                <div className="p-4">
                <table className="calculator-table">
                    <thead>
                        <tr className="border-b-2 border-primary-700">
                            <th className="text-primary-700 font-semibold text-left py-3 px-2">Riegl Strahlaufweitung</th>
                            <th className="text-primary-700 font-semibold text-center py-3 px-2"><span className="text-slate-900">Ein</span><span className="text-slate-400"> / </span><span className="text-primary-700">Ausgabe</span></th>
                            <th className="text-primary-700 font-semibold text-center py-3 px-2">Einheit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="calculator-row">
                            <td className="py-2 px-2 font-medium text-gray-700">Messentfernung</td>
                            <td className="py-2 px-2 text-center font-semibold">
                                {sRIsSet
                                    ? <p className="text-black">{sR.toFixed(1).replace(".", ",")}</p>
                                    : <p className="text-primary-700">-</p>
                                }
                            </td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m" className="inline-block h-auto w-auto max-w-full"></Image></td>
                        </tr>
                        <tr className="calculator-row">
                            <td className="py-2 px-2 font-medium text-gray-700">Pointer 1 mRad</td>
                            <td className="py-2 px-2 text-center font-semibold text-primary-700">
                                {rieglPointer1
                                    ? <p>{rieglPointer1}</p>
                                    : <p>-</p>
                                }
                            </td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m" className="inline-block h-auto w-auto max-w-full"></Image></td>
                        </tr>
                        <tr className="calculator-row">
                            <td className="py-2 px-2 font-medium text-gray-700">Strahlaufweitung 3 mRad</td>
                            <td className="py-2 px-2 text-center font-semibold text-primary-700">
                                {rieglBeam3
                                    ? <p>{rieglBeam3}</p>
                                    : <p>-</p>
                                }
                            </td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m" className="inline-block h-auto w-auto max-w-full"></Image></td>
                        </tr>
                        <tr className="calculator-row-last">
                            <td className="py-2 px-2 font-medium text-gray-700">Zielerfassungsbereich 5 mRad</td>
                            <td className="py-2 px-2 text-center font-semibold text-primary-700">
                                {rieglTarget5
                                    ? <p>{rieglTarget5}</p>
                                    : <p>-</p>
                                }
                            </td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m" className="inline-block h-auto w-auto max-w-full"></Image></td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>

        </div>
    )
}

export default VMT
