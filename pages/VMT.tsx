
import { useState, useEffect } from "react";
import Image from 'next/image'
import Head from 'next/head'
import SVG from '../assets/svg'
import html2canvas from 'html2canvas'

function VMT() {
    const [s, sSet] = useState<number>(NaN)
    const [sR, sRSet] = useState<number>(NaN)

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

    const handleScreenshot = async (tableId: string, filename: string) => {
        const buttons = document.querySelectorAll(`#${tableId} .screenshot-buttons`);
        const tables = document.querySelectorAll(`#${tableId} table`);
        const containers = document.querySelectorAll(`#${tableId} .p-4`);
        
        buttons.forEach(button => {
            (button as HTMLElement).style.display = 'none';
        });
        
        tables.forEach(table => {
            (table as HTMLElement).style.border = 'none';
            (table as HTMLElement).style.boxShadow = 'none';
        });
        
        containers.forEach(container => {
            (container as HTMLElement).style.backgroundColor = 'transparent';
        });
        
        const element = document.getElementById(tableId);
        if (element) {
            try {
                const canvas = await html2canvas(element, {
                    useCORS: true,
                    allowTaint: true,
                    logging: false,
                    foreignObjectRendering: false,
                    imageTimeout: 15000,
                    removeContainer: true,
                    scale: 4
                } as any);
                
                const link = document.createElement('a');
                link.download = filename;
                link.href = canvas.toDataURL();
                link.click();
            } catch (error) {
                console.error('Screenshot failed:', error);
            }
        }
        
        buttons.forEach(button => {
            (button as HTMLElement).style.display = 'flex';
        });
        
        tables.forEach(table => {
            (table as HTMLElement).style.border = '';
            (table as HTMLElement).style.boxShadow = '';
        });
        
        containers.forEach(container => {
            (container as HTMLElement).style.backgroundColor = '';
        });
    };

    const handleClipboard = async (tableId: string) => {
        const buttons = document.querySelectorAll(`#${tableId} .screenshot-buttons`);
        const tables = document.querySelectorAll(`#${tableId} table`);
        const containers = document.querySelectorAll(`#${tableId} .p-4`);
        
        buttons.forEach(button => {
            (button as HTMLElement).style.display = 'none';
        });
        
        tables.forEach(table => {
            (table as HTMLElement).style.border = 'none';
            (table as HTMLElement).style.boxShadow = 'none';
        });
        
        containers.forEach(container => {
            (container as HTMLElement).style.backgroundColor = 'transparent';
        });
        
        const element = document.getElementById(tableId);
        if (element) {
            try {
                const canvas = await html2canvas(element, {
                    useCORS: true,
                    allowTaint: true,
                    logging: false,
                    foreignObjectRendering: false,
                    imageTimeout: 15000,
                    removeContainer: true,
                    scale: 4
                } as any);
                
                canvas.toBlob(async (blob) => {
                    if (blob) {
                        try {
                            // Try modern clipboard API first
                            if (navigator.clipboard && navigator.clipboard.write) {
                                await navigator.clipboard.write([
                                    new ClipboardItem({ 'image/png': blob })
                                ]);
                            } else {
                                // Fallback: convert to data URL and show download for unsupported browsers
                                const dataUrl = canvas.toDataURL('image/png');
                                const link = document.createElement('a');
                                link.download = `${tableId}.png`;
                                link.href = dataUrl;
                                link.click();
                                
                                alert('Clipboard not supported on this browser. Image has been downloaded instead.');
                            }
                        } catch (error) {
                            console.error('Clipboard copy failed, trying fallback:', error);
                            // Fallback: download the image instead
                            const dataUrl = canvas.toDataURL('image/png');
                            const link = document.createElement('a');
                            link.download = `${tableId}.png`;
                            link.href = dataUrl;
                            link.click();
                            
                            alert('Clipboard copy failed. Image has been downloaded instead.');
                        }
                    }
                });
            } catch (error) {
                console.error('Screenshot failed:', error);
            }
        }
        
        buttons.forEach(button => {
            (button as HTMLElement).style.display = 'flex';
        });
        
        tables.forEach(table => {
            (table as HTMLElement).style.border = '';
            (table as HTMLElement).style.boxShadow = '';
        });
        
        containers.forEach(container => {
            (container as HTMLElement).style.backgroundColor = '';
        });
    };

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
                <div className="bg-[#0059a9] text-white px-6 py-3 flex justify-between items-center">
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
                            <td className="py-2 px-2 text-center">
                                <input 
                                    type="number" 
                                    placeholder="m" 
                                    value={isNaN(s) ? '' : s} 
                                    onWheel={e => e.currentTarget.blur()} 
                                    onChange={(e) => {
                                        const value = e.target.valueAsNumber;
                                        sSet(value);
                                        if (!isNaN(value)) {
                                            sessionStorage.setItem('vmt_s', value.toString());
                                        } else {
                                            sessionStorage.removeItem('vmt_s');
                                        }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                                />
                            </td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m"></Image></td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>

            <div id="eso-ergebnisse" className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
                <div className="bg-[#0059a9] text-white px-6 py-3 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">ESO Ergebnisse</h2>
                    <div className="screenshot-buttons flex gap-2">
                        <button 
                            onClick={() => handleClipboard('eso-ergebnisse')}
                            className="bg-white text-[#0059a9] px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white"
                            title="In Zwischenablage kopieren"
                        >
                            Kopieren
                        </button>
                        <button 
                            onClick={() => handleScreenshot('eso-ergebnisse', 'eso-ergebnisse.png')}
                            className="bg-transparent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 hover:shadow-sm transition-all duration-200 border border-white"
                            title="Als PNG herunterladen"
                        >
                            Download
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
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m"></Image></td>
                        </tr>
                        <tr className="hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-2 font-medium text-gray-700">Durchmesser</td>
                            <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{solveMax()}</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m"></Image></td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>

            <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
                <div className="bg-[#0059a9] text-white px-6 py-3 flex justify-between items-center">
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
                            <td className="py-2 px-2 text-center">
                                <input 
                                    type="number" 
                                    placeholder="m" 
                                    value={isNaN(sR) ? '' : sR} 
                                    onWheel={e => e.currentTarget.blur()} 
                                    onChange={(e) => {
                                        const value = e.target.valueAsNumber;
                                        sRSet(value);
                                        if (!isNaN(value)) {
                                            sessionStorage.setItem('vmt_sR', value.toString());
                                        } else {
                                            sessionStorage.removeItem('vmt_sR');
                                        }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                                />
                            </td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m"></Image></td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>

            <div id="riegl-ergebnisse" className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
                <div className="bg-[#0059a9] text-white px-6 py-3 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Riegl Ergebnisse</h2>
                    <div className="screenshot-buttons flex gap-2">
                        <button 
                            onClick={() => handleClipboard('riegl-ergebnisse')}
                            className="bg-white text-[#0059a9] px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white"
                            title="In Zwischenablage kopieren"
                        >
                            Kopieren
                        </button>
                        <button 
                            onClick={() => handleScreenshot('riegl-ergebnisse', 'riegl-ergebnisse.png')}
                            className="bg-transparent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 hover:shadow-sm transition-all duration-200 border border-white"
                            title="Als PNG herunterladen"
                        >
                            Download
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
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m"></Image></td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-2 font-medium text-gray-700">Pointer 1 mRad</td>
                            <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{(sR * 0.001).toFixed(3).replace(".", ",")}</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m"></Image></td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-2 font-medium text-gray-700">Strahlaufweitung 3 mRad</td>
                            <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{(sR * 0.003).toFixed(3).replace(".", ",")}</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m"></Image></td>
                        </tr>
                        <tr className="hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-2 font-medium text-gray-700">Zielerfassungsbereich 5 mRad</td>
                            <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{(sR * 0.005).toFixed(3).replace(".", ",")}</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m"></Image></td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>

        </div>
    )
}

export default VMT
