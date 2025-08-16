
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

    return (

        <div className="grid gap-6 mx-auto max-w-7xl px-4 py-8 lg:grid-cols-2">
            <Head>
                <title>VMT | ESO</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width" />
            </Head>


            <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
                <div className="bg-gradient-to-r from-[#0059a9] to-[#003d7a] text-white px-6 py-3 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">ESO</h2>
                    <button 
                        onClick={handleResetESO}
                        className="bg-white text-[#0059a9] px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white"
                        title="ESO Eingaben zurücksetzen"
                    >
                        Reset
                    </button>
                </div>
                <div className="p-4">
                <table className="w-full text-sm border border-[#0059a9] rounded-lg overflow-hidden shadow-md shadow-blue-200/50 border-b-2 border-r-2">
                    <thead>
                        <tr className="border-b-2 border-[#0059a9]">
                            <th className="text-[#0059a9] font-semibold text-left py-3 px-2">ESO Strahlaufweitung</th>
                            <th className="text-[#0059a9] font-semibold text-center py-3 px-2"><span className="text-[#0059a9]">Ein</span> / Ausgabe</th>
                            <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Einheit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-2 font-medium text-gray-700">Messentfernung</td>
                            <td className="py-2 px-2">
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
                                />
                            </td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m" className="inline-block max-w-full h-auto"></Image></td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>

            <div id="eso-ergebnisse" className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
                <div className="bg-gradient-to-r from-[#0059a9] to-[#003d7a] text-white px-6 py-3 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">ESO Ergebnisse</h2>
                    <div className="screenshot-buttons flex gap-2">
                        <button 
                            onClick={() => handleClipboard('eso-ergebnisse')}
                            disabled={isProcessing}
                            className="bg-white text-[#0059a9] px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white disabled:opacity-50 disabled:cursor-not-allowed"
                            title="In Zwischenablage kopieren"
                        >
                            {isProcessing ? 'Kopiere...' : 'Kopieren'}
                        </button>
                        <button 
                            onClick={() => handleScreenshot('eso-ergebnisse', 'eso-ergebnisse.png')}
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
                            <th className="text-[#0059a9] font-semibold text-left py-3 px-2">ESO Strahlaufweitung</th>
                            <th className="text-[#0059a9] font-semibold text-center py-3 px-2"><span className="text-[#0059a9]">Ein</span> / Ausgabe</th>
                            <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Einheit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-2 font-medium text-gray-700">Messentfernung</td>
                            <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{s.toFixed(1).replace(".", ",")}</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m" className="inline-block max-w-full h-auto"></Image></td>
                        </tr>
                        <tr className="hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-2 font-medium text-gray-700">Durchmesser</td>
                            <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{solveMax()}</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m" className="inline-block max-w-full h-auto"></Image></td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>

            <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
                <div className="bg-gradient-to-r from-[#0059a9] to-[#003d7a] text-white px-6 py-3 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Riegl</h2>
                    <button 
                        onClick={handleResetRiegl}
                        className="bg-white text-[#0059a9] px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white"
                        title="Riegl Eingaben zurücksetzen"
                    >
                        Reset
                    </button>
                </div>
                <div className="p-4">
                <table className="w-full text-sm border border-[#0059a9] rounded-lg overflow-hidden shadow-md shadow-blue-200/50 border-b-2 border-r-2">
                    <thead>
                        <tr className="border-b-2 border-[#0059a9]">
                            <th className="text-[#0059a9] font-semibold text-left py-3 px-2">Riegl Strahlaufweitung</th>
                            <th className="text-[#0059a9] font-semibold text-center py-3 px-2"><span className="text-[#0059a9]">Ein</span> / Ausgabe</th>
                            <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Einheit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-2 font-medium text-gray-700">Messentfernung</td>
                            <td className="py-2 px-2">
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
                                />
                            </td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m" className="inline-block max-w-full h-auto"></Image></td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>

            <div id="riegl-ergebnisse" className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
                <div className="bg-gradient-to-r from-[#0059a9] to-[#003d7a] text-white px-6 py-3 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Riegl Ergebnisse</h2>
                    <div className="screenshot-buttons flex gap-2">
                        <button 
                            onClick={() => handleClipboard('riegl-ergebnisse')}
                            disabled={isProcessing}
                            className="bg-white text-[#0059a9] px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white disabled:opacity-50 disabled:cursor-not-allowed"
                            title="In Zwischenablage kopieren"
                        >
                            {isProcessing ? 'Kopiere...' : 'Kopieren'}
                        </button>
                        <button 
                            onClick={() => handleScreenshot('riegl-ergebnisse', 'riegl-ergebnisse.png')}
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
                            <th className="text-[#0059a9] font-semibold text-left py-3 px-2">Riegl Strahlaufweitung</th>
                            <th className="text-[#0059a9] font-semibold text-center py-3 px-2"><span className="text-[#0059a9]">Ein</span> / Ausgabe</th>
                            <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Einheit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-2 font-medium text-gray-700">Messentfernung</td>
                            <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{sR.toFixed(1).replace(".", ",")}</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m" className="inline-block max-w-full h-auto"></Image></td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-2 font-medium text-gray-700">Pointer 1 mRad</td>
                            <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{(sR * 0.001).toFixed(3).replace(".", ",")}</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m" className="inline-block max-w-full h-auto"></Image></td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-2 font-medium text-gray-700">Strahlaufweitung 3 mRad</td>
                            <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{(sR * 0.003).toFixed(3).replace(".", ",")}</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m" className="inline-block max-w-full h-auto"></Image></td>
                        </tr>
                        <tr className="hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-2 font-medium text-gray-700">Zielerfassungsbereich 5 mRad</td>
                            <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{(sR * 0.005).toFixed(3).replace(".", ",")}</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m" className="inline-block max-w-full h-auto"></Image></td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>

        </div>
    )
}

export default VMT
