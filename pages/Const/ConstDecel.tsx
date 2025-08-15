import * as util from '../../components/utilConst'
import { useState, useEffect } from "react";
import Image from 'next/image'
import SVG from '../../assets/svg'
import html2canvas from 'html2canvas'

function ConstDecel() {
    const [vA, vAset] = useState<number>(NaN)
    const [vE, vEset] = useState<number>(NaN)
    const [a, aset] = useState<number>(NaN)
    const [s, sset] = useState<number>(NaN)
    const [t, tset] = useState<number>(NaN)

    // Load saved values from sessionStorage on component mount
    useEffect(() => {
        const savedVA = sessionStorage.getItem('constDecel_vA');
        const savedVE = sessionStorage.getItem('constDecel_vE');
        const savedA = sessionStorage.getItem('constDecel_a');
        const savedS = sessionStorage.getItem('constDecel_s');
        const savedT = sessionStorage.getItem('constDecel_t');
        
        if (savedVA && !isNaN(parseFloat(savedVA))) vAset(parseFloat(savedVA));
        if (savedVE && !isNaN(parseFloat(savedVE))) vEset(parseFloat(savedVE));
        if (savedA && !isNaN(parseFloat(savedA))) aset(parseFloat(savedA));
        if (savedS && !isNaN(parseFloat(savedS))) sset(parseFloat(savedS));
        if (savedT && !isNaN(parseFloat(savedT))) tset(parseFloat(savedT));
    }, []);

    // Reset function to clear all input fields and sessionStorage
    const handleReset = () => {
        vAset(NaN);
        vEset(NaN);
        aset(NaN);
        sset(NaN);
        tset(NaN);
        
        // Clear from sessionStorage
        sessionStorage.removeItem('constDecel_vA');
        sessionStorage.removeItem('constDecel_vE');
        sessionStorage.removeItem('constDecel_a');
        sessionStorage.removeItem('constDecel_s');
        sessionStorage.removeItem('constDecel_t');
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
                <div className="bg-[#0059a9] text-white px-6 py-3 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">konstante Verzögerung</h2>
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
                            <td className="py-2 px-2 font-medium text-gray-700">Anfangsgeschwindigkeit</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.vA} alt="vA" className="absolute z-0"></Image></td>
                            <td className="py-2 px-2 text-center">
                                <input 
                                    type="number" 
                                    placeholder="v in km/h" 
                                    value={isNaN(vA) ? '' : vA} 
                                    onWheel={e => e.currentTarget.blur()} 
                                    onChange={(e) => {
                                        const value = e.target.valueAsNumber;
                                        vAset(value);
                                        if (!isNaN(value)) {
                                            sessionStorage.setItem('constDecel_vA', value.toString());
                                        } else {
                                            sessionStorage.removeItem('constDecel_vA');
                                        }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                                />
                            </td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.kmh} alt="kmh" className="absolute z-0"></Image></td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-2 font-medium text-gray-700">Endgeschwindigkeit</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.vE} alt="vE" className="absolute z-0"></Image></td>
                            <td className="py-2 px-2 text-center">
                                <input 
                                    type="number" 
                                    placeholder="v in km/h" 
                                    value={isNaN(vE) ? '' : vE} 
                                    onWheel={e => e.currentTarget.blur()} 
                                    onChange={(e) => {
                                        const value = e.target.valueAsNumber;
                                        vEset(value);
                                        if (!isNaN(value)) {
                                            sessionStorage.setItem('constDecel_vE', value.toString());
                                        } else {
                                            sessionStorage.removeItem('constDecel_vE');
                                        }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                                />
                            </td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.kmh} alt="kmh" className="absolute z-0"></Image></td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-2 font-medium text-gray-700">Verzögerung</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.a} alt="a" className="absolute z-0"></Image></td>
                            <td className="py-2 px-2 text-center">
                                <input 
                                    type="number" 
                                    placeholder="a in m/s²" 
                                    value={isNaN(a) ? '' : a} 
                                    onWheel={e => e.currentTarget.blur()} 
                                    onChange={(e) => {
                                        const value = e.target.valueAsNumber;
                                        aset(value);
                                        if (!isNaN(value)) {
                                            sessionStorage.setItem('constDecel_a', value.toString());
                                        } else {
                                            sessionStorage.removeItem('constDecel_a');
                                        }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                                />
                            </td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.ms2} alt="ms2" className="absolute z-0"></Image></td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-2 font-medium text-gray-700">Verzögerungsstrecke</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.s} alt="s" className="absolute z-0"></Image></td>
                            <td className="py-2 px-2 text-center">
                                <input 
                                    type="number" 
                                    placeholder="s in Meter" 
                                    value={isNaN(s) ? '' : s} 
                                    onWheel={e => e.currentTarget.blur()} 
                                    onChange={(e) => {
                                        const value = e.target.valueAsNumber;
                                        sset(value);
                                        if (!isNaN(value)) {
                                            sessionStorage.setItem('constDecel_s', value.toString());
                                        } else {
                                            sessionStorage.removeItem('constDecel_s');
                                        }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                                />
                            </td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.m} alt="m" className="absolute z-0"></Image></td>
                        </tr>
                        <tr className="hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-2 font-medium text-gray-700">Verzögerungsdauer</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.t} alt="t" className="absolute z-0"></Image></td>
                            <td className="py-2 px-2 text-center">
                                <input 
                                    type="number" 
                                    placeholder="t in Sekunden" 
                                    value={isNaN(t) ? '' : t} 
                                    onWheel={e => e.currentTarget.blur()} 
                                    onChange={(e) => {
                                        const value = e.target.valueAsNumber;
                                        tset(value);
                                        if (!isNaN(value)) {
                                            sessionStorage.setItem('constDecel_t', value.toString());
                                        } else {
                                            sessionStorage.removeItem('constDecel_t');
                                        }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:border-transparent text-center"
                                />
                            </td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.s} alt="s" className="absolute z-0"></Image></td>
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
                            <td className="py-2 px-2 font-medium text-gray-700">Anfangsgeschwindigkeit</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.vA} alt="vA" className="absolute z-0"></Image></td>
                            <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{isError() ? <p className="text-red-500">ERROR</p> : (solveVA() ? solveVA() : <p className="text-[#0059a9]">{vA.toFixed(2).replace(".", ",")} km/h</p>)}</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={formVA()} alt="vA" ></Image></td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-2 font-medium text-gray-700">Endgeschwindigkeit</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.vE} alt="vE" className="absolute z-0"></Image></td>
                            <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{isError() ? <p className="text-red-500">ERROR</p> : (solveVE() ? solveVE() : <p className="text-[#0059a9]">{vE.toFixed(2).replace(".", ",")} km/h</p>)}</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={formVE()} alt="vE" className="absolute z-0"></Image></td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-2 font-medium text-gray-700">Verzögerung</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.a} alt="a" className="absolute z-0"></Image></td>
                            <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{isError() ? <p className="text-red-500">ERROR</p> : (solveA() ? solveA() : <p className="text-[#0059a9]">{a.toFixed(2).replace(".", ",")} m/s²</p>)}</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={formA()} alt="a" className="absolute z-0"></Image></td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-2 font-medium text-gray-700">Verzögerungsstrecke</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.s} alt="s" className="absolute z-0"></Image></td>
                            <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{isError() ? <p className="text-red-500">ERROR</p> : (solveS() ? solveS() : <p className="text-[#0059a9]">{s.toFixed(2).replace(".", ",")} m</p>)}</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={formS()} alt="s" ></Image></td>
                        </tr>
                        <tr className="hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-2 font-medium text-gray-700">Verzögerungsdauer</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={SVG.t} alt="t" ></Image></td>
                            <td className="py-2 px-2 text-center font-semibold text-[#0059a9]">{isError() ? <p className="text-red-500">ERROR</p> : (solveT() ? solveT() : <p className="text-[#0059a9]">{t.toFixed(2).replace(".", ",")} s</p>)}</td>
                            <td className="py-2 px-2 text-center"><Image unoptimized src={formT()} alt="t" ></Image></td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
        </>
    )
}

export default ConstDecel
