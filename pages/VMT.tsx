
import { useState } from "react";
import Image from 'next/image'
import Head from 'next/head'
import SVG from '../assets/svg'
import html2canvas from 'html2canvas'

function VMT() {
    const [s, sSet] = useState<number>(NaN)
    const [sR, sRSet] = useState<number>(NaN)
    // const [sMax, sMaxSet] = useState<number>(NaN)
    // const [dMax, dMaxSet] = useState<number>(NaN)

    const handleScreenshot = async (tableId: string, filename: string) => {
        const buttons = document.querySelectorAll(`#${tableId} .screenshot-buttons`);
        buttons.forEach(button => {
            (button as HTMLElement).style.display = 'none';
        });
        
        const element = document.getElementById(tableId);
        if (element) {
            try {
                const canvas = await html2canvas(element, {
                    useCORS: true,
                    allowTaint: true,
                    scale: 2,
                    logging: false,
                    foreignObjectRendering: false,
                    imageTimeout: 15000,
                    removeContainer: true
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
    };

    const handleClipboard = async (tableId: string) => {
        const buttons = document.querySelectorAll(`#${tableId} .screenshot-buttons`);
        buttons.forEach(button => {
            (button as HTMLElement).style.display = 'none';
        });
        
        const element = document.getElementById(tableId);
        if (element) {
            try {
                const canvas = await html2canvas(element, {
                    useCORS: true,
                    allowTaint: true,
                    scale: 2,
                    logging: false,
                    foreignObjectRendering: false,
                    imageTimeout: 15000,
                    removeContainer: true
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
                <div className="bg-[#0059a9] text-white px-6 py-3">
                    <h2 className="text-lg font-semibold">ESO</h2>
                </div>
                <div className="p-6">
                <table>
                    <tbody>
                        <tr>
                            <th>ESO Strahlaufweitung</th>
                            <th><span className="text-[#0059a9]">Ein</span> / Ausgabe</th>
                            <th>Einheit</th>

                        </tr>
                        <tr>
                            <th>Messentfernung</th>
                            <th>
                                <div>
                                    <input type="number" placeholder="m" defaultValue={''} onWheel={e => e.currentTarget.blur()} onChange={(e) => sSet(e.target.valueAsNumber)} />
                                </div>
                            </th>
                            <th><Image src={SVG.m} alt="kmh"></Image></th>
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
                <div className="p-6">
                <table>
                    <tbody>
                        <tr>
                            <th>ESO Strahlaufweitung</th>
                            <th><span className="text-[#0059a9]">Ein</span> / Ausgabe</th>
                            <th>Einheit</th>

                        </tr>
                        <tr>
                            <th>Messentfernung</th>
                            <th className="text-[#0059a9]">{s.toFixed(1).replace(".", ",")}</th>
                            <th><Image src={SVG.m} alt="m"></Image></th>
                        </tr>
                        <tr>
                            <th>Durchmesser</th>
                            <th>{solveMax()}</th>
                            <th><Image src={SVG.m} alt="s"></Image></th>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>

            <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
                <div className="bg-[#0059a9] text-white px-6 py-3">
                    <h2 className="text-lg font-semibold">Riegl</h2>
                </div>
                <div className="p-6">
                <table>
                    <tbody>
                        <tr>
                            <th>Riegl Strahlaufweitung</th>
                            <th><span className="text-[#0059a9]">Ein</span> / Ausgabe</th>
                            <th>Einheit</th>

                        </tr>
                        <tr>
                            <th>Messentfernung</th>
                            <th>
                                <div>
                                    <input type="number" placeholder="m" defaultValue={''} onWheel={e => e.currentTarget.blur()} onChange={(e) => sRSet(e.target.valueAsNumber)} />
                                </div>
                            </th>
                            <th><Image src={SVG.m} alt="kmh"></Image></th>
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
                <div className="p-6">
                <table>
                    <tbody>
                        <tr>
                            <th>ESO Strahlaufweitung</th>
                            <th><span className="text-[#0059a9]">Ein</span> / Ausgabe</th>
                            <th>Einheit</th>
                        </tr>
                        <tr>
                            <th>Messentfernung</th>
                            <th className="text-[#0059a9]">{sR.toFixed(1).replace(".", ",")}</th>
                            <th><Image src={SVG.m} alt="m"></Image></th>
                        </tr>
                        <tr>
                            <th>Pointer 1 mRad</th>
                            <th>{(sR * 0.001).toFixed(3).replace(".", ",")}</th>
                            <th><Image src={SVG.m} alt="m"></Image></th>
                        </tr>
                        <tr>
                            <th>Strahlaufweitung 3 mRad</th>
                            <th>{(sR * 0.003).toFixed(3).replace(".", ",")}</th>
                            <th><Image src={SVG.m} alt="s"></Image></th>
                        </tr>
                        <tr>
                            <th>Zielerfassungsbereich 5 mRad</th>
                            <th>{(sR * 0.005).toFixed(3).replace(".", ",")}</th>
                            <th><Image src={SVG.m} alt="s"></Image></th>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>

        </div>
    )
}

export default VMT
