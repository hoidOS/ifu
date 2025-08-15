
import * as util from '../../components/utilConst'
import { useState } from "react";
import Image from 'next/image'
import SVG from '../../assets/svg'
import html2canvas from 'html2canvas'


function ConstAccel() {
    const [v, setV] = useState<number>(NaN)
    const [s, setS] = useState<number>(NaN)
    const [t, setT] = useState<number>(NaN)

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
                    width: element.scrollWidth * 2,
                    height: element.scrollHeight * 2
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
                    width: element.scrollWidth * 2,
                    height: element.scrollHeight * 2
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
                <div className="bg-[#0059a9] text-white px-6 py-3">
                    <h2 className="text-lg font-semibold">Konstantfahrt</h2>
                </div>
                <div className="p-6">
                <table>
                    <tbody>
                        <tr>
                            <th>Art</th>
                            <th>Var</th>
                            <th>Eingabe</th>
                            <th>Einheit</th>
                        </tr>
                        <tr>
                            <th>Geschwindigkeit</th>
                            <th><Image src={SVG.v} alt="v"></Image></th>
                            <th>
                                <div>
                                    <input type="number" placeholder="v in km/h" defaultValue={''} onWheel={e => e.currentTarget.blur()} onChange={(e) => setV(e.target.valueAsNumber)} />
                                </div>
                            </th>
                            <th><Image src={SVG.kmh} alt="kmh"></Image></th>
                        </tr>
                        <tr>
                            <th>Strecke</th>
                            <th><Image src={SVG.s} alt="s"></Image></th>
                            <th>
                                <div>
                                    <input type="number" placeholder="s in Meter" defaultValue={''} onWheel={e => e.currentTarget.blur()} onChange={(e) => setS(e.target.valueAsNumber)} />
                                </div>
                            </th>
                            <th><Image src={SVG.m} alt="m"></Image></th>
                        </tr>
                        <tr>
                            <th>Dauer</th>
                            <th><Image src={SVG.t} alt="t"></Image></th>
                            <th>
                                <div>
                                    <input type="number" placeholder="t in Sekunden" defaultValue={''} onWheel={e => e.currentTarget.blur()} onChange={(e) => setT(e.target.valueAsNumber)} />
                                </div>
                            </th>
                            <th><Image src={SVG.s} alt="s"></Image></th>
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
                            <th>Geschwindigkeit</th>
                            <th><Image src={SVG.v} alt="v" ></Image></th>
                            <th>{(vIsSet && sIsSet && tIsSet) ? <p className="text-red-600">ERROR</p> : (!vIsSet ? <p>{vO}</p> : <p className="text-[#0059a9]">{v.toFixed(2).replace(".", ",")} km/h</p>)}</th>
                            <th><Image src={SVG.dvF} alt="dvF" ></Image></th>
                        </tr>
                        <tr>
                            <th>Strecke</th>
                            <th><Image src={SVG.s} alt="vA" ></Image></th>
                            <th>{(vIsSet && sIsSet && tIsSet) ? <p className="text-red-600">ERROR</p> : (!sIsSet ? <p>{sO}</p> : <p className="text-[#0059a9]">{s.toFixed(2).replace(".", ",")} m</p>)}</th>
                            <th><Image src={SVG.dsF} alt="dsF" ></Image></th>
                        </tr>
                        <tr>
                            <th>Dauer</th>
                            <th><Image src={SVG.t} alt="vA" ></Image></th>
                            <th>{(vIsSet && sIsSet && tIsSet) ? <p className="text-red-600">ERROR</p> : (!tIsSet ? <p>{tO}</p> : <p className="text-[#0059a9]">{t.toFixed(2).replace(".", ",")} s</p>)}</th>
                            <th><Image src={SVG.dtF} alt="dtF" ></Image></th>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
        </>
    )
}

export default ConstAccel
