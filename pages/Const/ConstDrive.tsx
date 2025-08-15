
import * as util from '../../components/utilConst'
import { useState, useEffect } from "react";
import Image from 'next/image'
import SVG from '../../assets/svg'
import html2canvas from 'html2canvas'


function ConstAccel() {
    const [v, setV] = useState<number>(NaN)
    const [s, setS] = useState<number>(NaN)
    const [t, setT] = useState<number>(NaN)

    // Load saved values from sessionStorage on component mount
    useEffect(() => {
        const savedV = sessionStorage.getItem('constDrive_v');
        const savedS = sessionStorage.getItem('constDrive_s');
        const savedT = sessionStorage.getItem('constDrive_t');
        
        if (savedV && !isNaN(parseFloat(savedV))) setV(parseFloat(savedV));
        if (savedS && !isNaN(parseFloat(savedS))) setS(parseFloat(savedS));
        if (savedT && !isNaN(parseFloat(savedT))) setT(parseFloat(savedT));
    }, []);

    // Reset function to clear all input fields and sessionStorage
    const handleReset = () => {
        setV(NaN);
        setS(NaN);
        setT(NaN);
        
        // Clear from sessionStorage
        sessionStorage.removeItem('constDrive_v');
        sessionStorage.removeItem('constDrive_s');
        sessionStorage.removeItem('constDrive_t');
    };

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
                                link.download = `berechnungen-${tableId}.png`;
                                link.href = dataUrl;
                                link.click();
                                
                                alert('Clipboard not supported on this browser. Image has been downloaded instead.');
                            }
                        } catch (error) {
                            console.error('Clipboard copy failed, trying fallback:', error);
                            // Fallback: download the image instead
                            const dataUrl = canvas.toDataURL('image/png');
                            const link = document.createElement('a');
                            link.download = `berechnungen-${tableId}.png`;
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

    const vIsSet = v >= 0 || !isNaN
    const sIsSet = s >= 0 || !isNaN
    const tIsSet = t >= 0 || !isNaN

    const vO = util.getSpeed(s, t)
    const sO = util.getDistance(v, t)
    const tO = util.getTime(s, v)

    return (
        <>
            <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
                <div className="bg-[#0059a9] text-white px-6 py-3 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Konstantfahrt</h2>
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
                            <td className="py-2 px-2 font-medium text-gray-700">Geschwindigkeit</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.v} alt="v"></Image></td>
                            <td className="py-2 px-2 text-center">
                                <input 
                                    type="number" 
                                    placeholder="v in km/h" 
                                    value={isNaN(v) ? '' : v} 
                                    onWheel={e => e.currentTarget.blur()} 
                                    onChange={(e) => {
                                        const value = e.target.valueAsNumber;
                                        setV(value);
                                        if (!isNaN(value)) {
                                            sessionStorage.setItem('constDrive_v', value.toString());
                                        } else {
                                            sessionStorage.removeItem('constDrive_v');
                                        }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                                />
                            </td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.kmh} alt="kmh"></Image></td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-2 font-medium text-gray-700">Strecke</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.s} alt="s"></Image></td>
                            <td className="py-2 px-2 text-center">
                                <input 
                                    type="number" 
                                    placeholder="s in Meter" 
                                    value={isNaN(s) ? '' : s} 
                                    onWheel={e => e.currentTarget.blur()} 
                                    onChange={(e) => {
                                        const value = e.target.valueAsNumber;
                                        setS(value);
                                        if (!isNaN(value)) {
                                            sessionStorage.setItem('constDrive_s', value.toString());
                                        } else {
                                            sessionStorage.removeItem('constDrive_s');
                                        }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                                />
                            </td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m"></Image></td>
                        </tr>
                        <tr className="hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-2 font-medium text-gray-700">Dauer</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.t} alt="t"></Image></td>
                            <td className="py-2 px-2 text-center">
                                <input 
                                    type="number" 
                                    placeholder="t in Sekunden" 
                                    value={isNaN(t) ? '' : t} 
                                    onWheel={e => e.currentTarget.blur()} 
                                    onChange={(e) => {
                                        const value = e.target.valueAsNumber;
                                        setT(value);
                                        if (!isNaN(value)) {
                                            sessionStorage.setItem('constDrive_t', value.toString());
                                        } else {
                                            sessionStorage.removeItem('constDrive_t');
                                        }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                                />
                            </td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.s} alt="s"></Image></td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>

            <div id="berechnungen-drive" className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
                <div className="bg-[#0059a9] text-white px-6 py-3 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Berechnungen</h2>
                    <div className="screenshot-buttons flex gap-2">
                        <button 
                            onClick={() => handleClipboard('berechnungen-drive')}
                            className="bg-white text-[#0059a9] px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white"
                            title="In Zwischenablage kopieren"
                        >
                            Kopieren
                        </button>
                        <button 
                            onClick={() => handleScreenshot('berechnungen-drive', 'berechnungen-konstantfahrt.png')}
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
                            <th className="text-[#0059a9] font-semibold text-left py-3 px-2">Art</th>
                            <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Var</th>
                            <th className="text-[#0059a9] font-semibold text-center py-3 px-2"><span className="text-[#0059a9]">Ein</span> / Ausgabe</th>
                            <th className="text-[#0059a9] font-semibold text-center py-3 px-2">Formel</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-2 font-medium text-gray-700">Geschwindigkeit</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.v} alt="v" ></Image></td>
                            <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{(vIsSet && sIsSet && tIsSet) ? <p className="text-red-600">ERROR</p> : (!vIsSet ? <p>{vO}</p> : <p className="text-[#0059a9]">{v.toFixed(2).replace(".", ",")} km/h</p>)}</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.dvF} alt="dvF" ></Image></td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-2 font-medium text-gray-700">Strecke</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.s} alt="s" ></Image></td>
                            <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{(vIsSet && sIsSet && tIsSet) ? <p className="text-red-600">ERROR</p> : (!sIsSet ? <p>{sO}</p> : <p className="text-[#0059a9]">{s.toFixed(2).replace(".", ",")} m</p>)}</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.dsF} alt="dsF" ></Image></td>
                        </tr>
                        <tr className="hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-2 font-medium text-gray-700">Dauer</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.t} alt="t" ></Image></td>
                            <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{(vIsSet && sIsSet && tIsSet) ? <p className="text-red-600">ERROR</p> : (!tIsSet ? <p>{tO}</p> : <p className="text-[#0059a9]">{t.toFixed(2).replace(".", ",")} s</p>)}</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.dtF} alt="dtF" ></Image></td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
        </>
    )
}

export default ConstAccel
