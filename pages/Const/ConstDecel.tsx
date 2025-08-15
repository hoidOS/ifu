import * as util from '../../components/utilConst'
import { useState } from "react";
import Image from 'next/image'
import SVG from '../../assets/svg'
import html2canvas from 'html2canvas'

function ConstDecel() {
    const [vA, vAset] = useState<number>(NaN)
    const [vE, vEset] = useState<number>(NaN)
    const [a, aset] = useState<number>(NaN)
    const [s, sset] = useState<number>(NaN)
    const [t, tset] = useState<number>(NaN)

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

    const solveVA = (): string | boolean => {
        if ((vE >= 0 && a >= 0 && s >= 0) && !(vA >= 0 || t >= 0)) {
            return util.getdVA1(vE, a, s)
        } else if ((vE >= 0 && a >= 0 && t >= 0) && !(vA >= 0 || s >= 0)) {
            return util.getdVA2(vE, a, t)
        } else if ((vE >= 0 && s >= 0 && t >= 0) && !(vA >= 0 || a >= 0)) {
            return util.getdVA3(vE, s, t)
        } else if ((a >= 0 && s >= 0 && t >= 0) && !(vA >= 0 || vE >= 0)) {
            return util.getdVA4(a, s, t)
        } else {
            return false
        }
    }
    
    const formVA = (): string => {
        if ((vE >= 0 && a >= 0 && s >= 0) && !(vA >= 0 || t >= 0)) {
            return SVG.dVA1
        } else if ((vE >= 0 && a >= 0 && t >= 0) && !(vA >= 0 || s >= 0)) {
            return SVG.dVA2
        } else if ((vE >= 0 && s >= 0 && t >= 0) && !(vA >= 0 || a >= 0)) {
            return SVG.dVA3
        } else if ((a >= 0 && s >= 0 && t >= 0) && !(vA >= 0 || vE >= 0)) {
            return SVG.dVA4
        } else {
            return SVG.NULL
        }
    }

    const solveVE = (): string | boolean => {
        if ((vA >= 0 && a >= 0 && s >= 0) && !(vE >= 0 || t >= 0)) {
            return util.getdVE1(vA, a, s)
        } else if ((vA >= 0 && a >= 0 && t >= 0) && !(vE >= 0 || s >= 0)) {
            return util.getdVE2(vA, a, t)
        } else if ((vA >= 0 && s >= 0 && t >= 0) && !(vE >= 0 || a >= 0)) {
            return util.getdVE3(vA, s, t)
        } else if ((a >= 0 && s >= 0 && t >= 0) && !(vA >= 0 || vE >= 0)) {
            return util.getdVE4(a, s, t)
        } else {
            return false
        }
    }
    
    const formVE = (): string => {
        if ((vA >= 0 && a >= 0 && s >= 0) && !(vE >= 0 || t >= 0)) {
            return SVG.dVE1
        } else if ((vA >= 0 && a >= 0 && t >= 0) && !(vE >= 0 || s >= 0)) {
            return SVG.dVE2
        } else if ((vA >= 0 && s >= 0 && t >= 0) && !(vE >= 0 || a >= 0)) {
            return SVG.dVE3
        } else if ((a >= 0 && s >= 0 && t >= 0) && !(vA >= 0 || vE >= 0)) {
            return SVG.dVE4
        } else {
            return SVG.NULL
        }
    }
    
    const solveA = (): string | boolean => {
        if ((vA >= 0 && vE >= 0 && s >= 0) && !(a >= 0 || t >= 0)) {
            return util.getDecel1(vA, vE, s)
        } else if ((vA >= 0 && vE >= 0 && t >= 0) && !(a >= 0 || s >= 0)) {
            return util.getDecel2(vA, vE, t)
        } else if ((vA >= 0 && s >= 0 && t >= 0) && !(a >= 0 || vE >= 0)) {
            return util.getDecel3(vA, s, t)
        } else if ((vE >= 0 && s >= 0 && t >= 0) && !(a >= 0 || vA >= 0)) {
            return util.getDecel4(vE, s, t)
        } else {
            return false
        }
    }
    
    const formA = (): string => {
        if ((vA >= 0 && vE >= 0 && s >= 0) && !(a >= 0 || t >= 0)) {
            return SVG.dA1
        } else if ((vA >= 0 && vE >= 0 && t >= 0) && !(a >= 0 || s >= 0)) {
            return SVG.dA2
        } else if ((vA >= 0 && s >= 0 && t >= 0) && !(a >= 0 || vE >= 0)) {
            return SVG.dA3
        } else if ((vE >= 0 && s >= 0 && t >= 0) && !(a >= 0 || vA >= 0)) {
            return SVG.dA4
        } else {
            return SVG.NULL
        }
    }
    
    const solveS = (): string | boolean => {
        if ((vA >= 0 && vE >= 0 && a >= 0) && !(s >= 0 || t >= 0)) {
            return util.getBD1(vA, vE, a)
        } else if ((vA >= 0 && vE >= 0 && t >= 0) && !(s >= 0 || a >= 0)) {
            return util.getBD2(vA, vE, t)
        } else if ((vA >= 0 && a >= 0 && t >= 0) && !(s >= 0 || vE >= 0)) {
            return util.getBD3(vA, a, t)
        } else if ((vE >= 0 && a >= 0 && t >= 0) && !(s >= 0 || vA >= 0)) {
            return util.getBD4(vE, a, t)
        } else {
            return false
        }
    }
    
    const formS = (): string => {
        if ((vA >= 0 && vE >= 0 && a >= 0) && !(s >= 0 || t >= 0)) {
            return SVG.dS1
        } else if ((vA >= 0 && vE >= 0 && t >= 0) && !(s >= 0 || a >= 0)) {
            return SVG.dS2
        } else if ((vA >= 0 && a >= 0 && t >= 0) && !(s >= 0 || vE >= 0)) {
            return SVG.dS3
        } else if ((vE >= 0 && a >= 0 && t >= 0) && !(s >= 0 || vA >= 0)) {
            return SVG.dS4
        } else {
            return SVG.NULL
        }
    }
    
    const solveT = (): string | boolean => {
        if ((vA >= 0 && vE >= 0 && a >= 0) && !(t >= 0 || s >= 0)) {
            return util.getBT1(vA, vE, a)
        } else if ((vA >= 0 && vE >= 0 && s >= 0) && !(t >= 0 || a >= 0)) {
            return util.getBT2(vA, vE, s)
        } else if ((vA >= 0 && a >= 0 && s >= 0) && !(t >= 0 || vE >= 0)) {
            return util.getBT3(vA, a, s)
        } else if ((vE >= 0 && a >= 0 && s >= 0) && !(t >= 0 || vA >= 0)) {
            return util.getBT4(vE, a, s)
        } else {
            return false
        }
    }
    
    const formT = (): string => {
        if ((vA >= 0 && vE >= 0 && a >= 0) && !(t >= 0 || s >= 0)) {
            return SVG.dT1
        } else if ((vA >= 0 && vE >= 0 && s >= 0) && !(t >= 0 || a >= 0)) {
            return SVG.dT2
        } else if ((vA >= 0 && a >= 0 && s >= 0) && !(t >= 0 || vE >= 0)) {
            return SVG.dT3
        } else if ((vE >= 0 && a >= 0 && s >= 0) && !(t >= 0 || vA >= 0)) {
            return SVG.dT4
        } else {
            return SVG.NULL
        }
    }

    const isError = (): boolean => {
        if (vA >= 0 && vE >= 0 && a >= 0 && s >= 0 && t >= 0) {
            return true
        } else if (vA >= 0 && vE >= 0 && a >= 0 && s >= 0) {
            return true
        } else if (vA >= 0 && vE >= 0 && a >= 0 && t >= 0) {
            return true
        } else if (vA >= 0 && vE >= 0 && s >= 0 && t >= 0) {
            return true
        } else if (vA >= 0 && a >= 0 && s >= 0 && t >= 0) {
            return true
        } else if (vE >= 0 && a >= 0 && s >= 0 && t >= 0) {
            return true
        } else {
            return false
        }
    }

    return (
        <>
            <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
                <div className="bg-[#0059a9] text-white px-6 py-3">
                    <h2 className="text-lg font-semibold">konstante Verzögerung</h2>
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
                            <th>Anfangsgeschwindigkeit</th>
                            <th><Image src={SVG.vA} alt="vA" ></Image></th>
                            <th>
                                <div>
                                    <input type="number" placeholder="v in km/h" defaultValue={''} onWheel={ e => e.currentTarget.blur()} onChange={(e) => vAset(e.target.valueAsNumber)} />
                                </div>
                            </th>
                            <th><Image src={SVG.kmh} alt="vA" ></Image></th>
                        </tr>
                        <tr>
                            <th>Endgeschwindigkeit</th>
                            <th><Image src={SVG.vE} alt="vA" ></Image></th>
                            <th>
                                <div>
                                    <input type="number" placeholder="v in km/h" defaultValue={''} onWheel={ e => e.currentTarget.blur()} onChange={(e) => vEset(e.target.valueAsNumber)} />
                                </div>
                            </th>
                            <th><Image src={SVG.kmh} alt="vA" ></Image></th>
                        </tr>
                        <tr>
                            <th>Verzögerung</th>
                            <th><Image src={SVG.a} alt="vA" ></Image></th>
                            <th>
                                <div>
                                    <input type="number" placeholder="a in m/s²" defaultValue={''} onWheel={ e => e.currentTarget.blur()} onChange={(e) => aset(e.target.valueAsNumber)} />
                                </div>
                            </th>
                            <th><Image src={SVG.ms2} alt="vA" ></Image></th>
                        </tr>
                        <tr>
                            <th>Verzögerungsstrecke</th>
                            <th><Image src={SVG.s} alt="vA" ></Image></th>
                            <th>
                                <div>
                                    <input type="number" placeholder="s in Meter" defaultValue={''} onWheel={ e => e.currentTarget.blur()} onChange={(e) => sset(e.target.valueAsNumber)} />
                                </div>
                            </th>
                            <th><Image src={SVG.m} alt="vA" ></Image></th>
                        </tr>
                        <tr>
                            <th>Verzögerungsdauer</th>
                            <th><Image src={SVG.t} alt="vA" ></Image></th>
                            <th>
                                <div>
                                    <input type="number" placeholder="t in Sekunden" defaultValue={''} onWheel={ e => e.currentTarget.blur()} onChange={(e) => tset(e.target.valueAsNumber)} />
                                </div>
                            </th>
                            <th><Image src={SVG.s} alt="vA" ></Image></th>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>

            <div id="berechnungen-decel" className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
                <div className="bg-[#0059a9] text-white px-6 py-3 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Berechnungen</h2>
                    <div className="screenshot-buttons flex gap-2">
                        <button 
                            onClick={() => handleClipboard('berechnungen-decel')}
                            className="bg-white text-[#0059a9] px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-white"
                            title="In Zwischenablage kopieren"
                        >
                            Kopieren
                        </button>
                        <button 
                            onClick={() => handleScreenshot('berechnungen-decel', 'berechnungen-verzoegerung.png')}
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
                            <th>Anfangsgeschwindigkeit</th>
                            <th><Image src={SVG.vA} alt="vA"></Image></th>
                            <th>{isError() ? <p className="text-red-500">ERROR</p> : (solveVA() ? solveVA() : <p className="text-[#0059a9]">{vA.toFixed(2).replace(".", ",")} km/h</p>)}</th>
                            <th><Image src={formVA()} alt="vA" ></Image></th>
                        </tr>
                        <tr>
                            <th>Endgeschwindigkeit</th>
                            <th><Image src={SVG.vE} alt="vA"></Image></th>
                            <th>{isError() ? <p className="text-red-500">ERROR</p> : (solveVE() ? solveVE() : <p className="text-[#0059a9]">{vE.toFixed(2).replace(".", ",")} km/h</p>)}</th>
                            <th><Image src={formVE()} alt="vE"></Image></th>
                        </tr>
                        <tr>
                            <th>Verzögerung</th>
                            <th><Image src={SVG.a} alt="vA"></Image></th>
                            <th>{isError() ? <p className="text-red-500">ERROR</p> : (solveA() ? solveA() : <p className="text-[#0059a9]">{a.toFixed(2).replace(".", ",")} m/s²</p>)}</th>
                            <th><Image src={formA()} alt="a"></Image></th>
                        </tr>
                        <tr>
                            <th>Verzögerungsstrecke</th>
                            <th><Image src={SVG.s} alt="vA"></Image></th>
                            <th>{isError() ? <p className="text-red-500">ERROR</p> : (solveS() ? solveS() : <p className="text-[#0059a9]">{s.toFixed(2).replace(".", ",")} m</p>)}</th>
                            <th><Image src={formS()} alt="s" ></Image></th>
                        </tr>
                        <tr>
                            <th>Verzögerungsdauer</th>
                            <th><Image src={SVG.t} alt="vA" ></Image></th>
                            <th>{isError() ? <p className="text-red-500">ERROR</p> : (solveT() ? solveT() : <p className="text-[#0059a9]">{t.toFixed(2).replace(".", ",")} s</p>)}</th>
                            <th><Image src={formT()} alt="t" ></Image></th>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
        </>
    )
}

export default ConstDecel
