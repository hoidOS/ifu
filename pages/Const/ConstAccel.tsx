import * as util from '../../components/utilConst'
import { useState } from "react";
import Image from 'next/image'
import SVG from '../../assets/svg'

function ConstAccel() {
    const [vA, vAset] = useState<number>(NaN)
    const [vE, vEset] = useState<number>(NaN)
    const [a, aset] = useState<number>(NaN)
    const [s, sset] = useState<number>(NaN)
    const [t, tset] = useState<number>(NaN)

    const solveVA = (): string | boolean => {
        if ((vE >= 0 && a >= 0 && s >= 0) && !(vA >= 0 || t >= 0)) {
            return util.getaVA1(vE, a, s)
        } else if ((vE >= 0 && a >= 0 && t >= 0) && !(vA >= 0 || s >= 0)) {
            return util.getaVA2(vE, a, t)
        } else if ((vE >= 0 && s >= 0 && t >= 0) && !(vA >= 0 || a >= 0)) {
            return util.getaVA3(vE, s, t)
        } else if ((a >= 0 && s >= 0 && t >= 0) && !(vA >= 0 || vE >= 0)) {
            return util.getaVA4(a, s, t)
        } else {
            return false
        }
    }

    const formVA = (): string => {
        if ((vE >= 0 && a >= 0 && s >= 0) && !(vA >= 0 || t >= 0)) {
            return SVG.aVA1
        } else if ((vE >= 0 && a >= 0 && t >= 0) && !(vA >= 0 || s >= 0)) {
            return SVG.aVA2
        } else if ((vE >= 0 && s >= 0 && t >= 0) && !(vA >= 0 || a >= 0)) {
            return SVG.aVA3
        } else if ((a >= 0 && s >= 0 && t >= 0) && !(vA >= 0 || vE >= 0)) {
            return SVG.aVA4
        } else {
            return SVG.NULL
        }
    }

    const solveVE = (): string | boolean => {
        if ((vA >= 0 && a >= 0 && s >= 0) && !(vE >= 0 || t >= 0)) {
            return util.getaVE1(vA, a, s)
        } else if ((vA >= 0 && a >= 0 && t >= 0) && !(vE >= 0 || s >= 0)) {
            return util.getaVE2(vA, a, t)
        } else if ((vA >= 0 && s >= 0 && t >= 0) && !(vE >= 0 || a >= 0)) {
            return util.getaVE3(vA, s, t)
        } else if ((a >= 0 && s >= 0 && t >= 0) && !(vA >= 0 || vE >= 0)) {
            return util.getaVE4(a, s, t)
        } else {
            return false
        }
    }

    const formVE = (): string => {
        if ((vA >= 0 && a >= 0 && s >= 0) && !(vE >= 0 || t >= 0)) {
            return SVG.aVE1
        } else if ((vA >= 0 && a >= 0 && t >= 0) && !(vE >= 0 || s >= 0)) {
            return SVG.aVE2
        } else if ((vA >= 0 && s >= 0 && t >= 0) && !(vE >= 0 || a >= 0)) {
            return SVG.aVE3
        } else if ((a >= 0 && s >= 0 && t >= 0) && !(vA >= 0 || vE >= 0)) {
            return SVG.aVE4
        } else {
            return SVG.NULL
        }
    }

    const solveA = (): string | boolean => {
        if ((vA >= 0 && vE >= 0 && s >= 0) && !(a >= 0 || t >= 0)) {
            return util.getAccel1(vA, vE, s)
        } else if ((vA >= 0 && vE >= 0 && t >= 0) && !(a >= 0 || s >= 0)) {
            return util.getAccel2(vA, vE, t)
        } else if ((vA >= 0 && s >= 0 && t >= 0) && !(a >= 0 || vE >= 0)) {
            return util.getAccel3(vA, s, t)
        } else if ((vE >= 0 && s >= 0 && t >= 0) && !(a >= 0 || vA >= 0)) {
            return util.getAccel4(vE, s, t)
        } else {
            return false
        }
    }

    const formA = (): string => {
        if ((vA >= 0 && vE >= 0 && s >= 0) && !(a >= 0 || t >= 0)) {
            return SVG.aA1
        } else if ((vA >= 0 && vE >= 0 && t >= 0) && !(a >= 0 || s >= 0)) {
            return SVG.aA2
        } else if ((vA >= 0 && s >= 0 && t >= 0) && !(a >= 0 || vE >= 0)) {
            return SVG.aA3
        } else if ((vE >= 0 && s >= 0 && t >= 0) && !(a >= 0 || vA >= 0)) {
            return SVG.aA4
        } else {
            return SVG.NULL
        }
    }

    const solveS = (): string | boolean => {
        if ((vA >= 0 && vE >= 0 && a >= 0) && !(s >= 0 || t >= 0)) {
            return util.getAD1(vA, vE, a)
        } else if ((vA >= 0 && vE >= 0 && t >= 0) && !(s >= 0 || a >= 0)) {
            return util.getAD2(vA, vE, t)
        } else if ((vA >= 0 && a >= 0 && t >= 0) && !(s >= 0 || vE >= 0)) {
            return util.getAD3(vA, a, t)
        } else if ((vE >= 0 && a >= 0 && t >= 0) && !(s >= 0 || vA >= 0)) {
            return util.getAD4(vE, a, t)
        } else {
            return false
        }
    }

    const formS = (): string => {
        if ((vA >= 0 && vE >= 0 && a >= 0) && !(s >= 0 || t >= 0)) {
            return SVG.aS1
        } else if ((vA >= 0 && vE >= 0 && t >= 0) && !(s >= 0 || a >= 0)) {
            return SVG.aS2
        } else if ((vA >= 0 && a >= 0 && t >= 0) && !(s >= 0 || vE >= 0)) {
            return SVG.aS3
        } else if ((vE >= 0 && a >= 0 && t >= 0) && !(s >= 0 || vA >= 0)) {
            return SVG.aS4
        } else {
            return SVG.NULL
        }
    }

    const solveT = (): string | boolean => {
        if ((vA >= 0 && vE >= 0 && a >= 0) && !(t >= 0 || s >= 0)) {
            return util.getAT1(vA, vE, a)
        } else if ((vA >= 0 && vE >= 0 && s >= 0) && !(t >= 0 || a >= 0)) {
            return util.getAT2(vA, vE, s)
        } else if ((vA >= 0 && a >= 0 && s >= 0) && !(t >= 0 || vE >= 0)) {
            return util.getAT3(vA, a, s)
        } else if ((vE >= 0 && a >= 0 && s >= 0) && !(t >= 0 || vA >= 0)) {
            return util.getAT4(vE, a, s)
        } else {
            return false
        }
    }

    const formT = (): string => {
        if ((vA >= 0 && vE >= 0 && a >= 0) && !(t >= 0 || s >= 0)) {
            return SVG.aT1
        } else if ((vA >= 0 && vE >= 0 && s >= 0) && !(t >= 0 || a >= 0)) {
            return SVG.aT2
        } else if ((vA >= 0 && a >= 0 && s >= 0) && !(t >= 0 || vE >= 0)) {
            return SVG.aT3
        } else if ((vE >= 0 && a >= 0 && s >= 0) && !(t >= 0 || vA >= 0)) {
            return SVG.aT4
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
            <div className="flex bg-[#0059a9] border-[1.25rem] border-[#0059a9] rounded-xl">
                <h1 className="pr-6 text-center text-[#fff] self-center">konstante Beschleunigung</h1>
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
                            <th><Image src={SVG.vA} alt="vA" className="absolute z-0"></Image></th>
                            <th>
                                <div>
                                    <input type="number" placeholder="v in km/h" defaultValue={''} onWheel={e => e.currentTarget.blur()} onChange={(e) => vAset(e.target.valueAsNumber)} />
                                </div>
                            </th>
                            <th><Image src={SVG.kmh} alt="vA" className="absolute z-0"></Image></th>
                        </tr>
                        <tr>
                            <th>Endgeschwindigkeit</th>
                            <th><Image src={SVG.vE} alt="vA" className="absolute z-0"></Image></th>
                            <th>
                                <div>
                                    <input type="number" placeholder="v in km/h" defaultValue={''} onWheel={e => e.currentTarget.blur()} onChange={(e) => vEset(e.target.valueAsNumber)} />
                                </div>
                            </th>
                            <th><Image src={SVG.kmh} alt="vA" className="absolute z-0"></Image></th>
                        </tr>
                        <tr>
                            <th>Beschleunigung</th>
                            <th><Image src={SVG.a} alt="vA" className="absolute z-0"></Image></th>
                            <th>
                                <div>
                                    <input type="number" placeholder="a in m/s²" defaultValue={''} onWheel={e => e.currentTarget.blur()} onChange={(e) => aset(e.target.valueAsNumber)} />
                                </div>
                            </th>
                            <th><Image src={SVG.ms2} alt="vA" className="absolute z-0"></Image></th>
                        </tr>
                        <tr>
                            <th>Beschleunigungsstrecke</th>
                            <th><Image src={SVG.s} alt="vA" className="absolute z-0"></Image></th>
                            <th>
                                <div>
                                    <input type="number" placeholder="s in Meter" defaultValue={''} onWheel={e => e.currentTarget.blur()} onChange={(e) => sset(e.target.valueAsNumber)} />
                                </div>
                            </th>
                            <th><Image src={SVG.m} alt="vA" className="absolute z-0"></Image></th>
                        </tr>
                        <tr>
                            <th>Beschleunigungsdauer</th>
                            <th><Image src={SVG.t} alt="vA" className="absolute z-0"></Image></th>
                            <th>
                                <div>
                                    <input type="number" placeholder="t in Sekunden" defaultValue={''} onWheel={e => e.currentTarget.blur()} onChange={(e) => tset(e.target.valueAsNumber)} />
                                </div>
                            </th>
                            <th><Image src={SVG.s} alt="vA" className="absolute z-0"></Image></th>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex bg-[#0059a9] border-[1.25rem] border-[#0059a9] rounded-xl">
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
                            <th><Image src={SVG.vA} alt="vA" className="absolute z-0"></Image></th>
                            <th>{isError() ? <p className="text-red-500">ERROR</p> : (solveVA() ? solveVA() : <p className="text-[#0059a9]">{vA.toFixed(2).replace(".", ",")} km/h</p>)}</th>
                            <th><Image src={formVA()} alt="vA" className="absolute z-0"></Image></th>
                        </tr>
                        <tr>
                            <th>Endgeschwindigkeit</th>
                            <th><Image src={SVG.vE} alt="vA" className="absolute z-0"></Image></th>
                            <th>{isError() ? <p className="text-red-500">ERROR</p> : (solveVE() ? solveVE() : <p className="text-[#0059a9]">{vE.toFixed(2).replace(".", ",")} km/h</p>)}</th>
                            <th><Image src={formVE()} alt="vA" className="absolute z-0"></Image></th>
                        </tr>
                        <tr>
                            <th>Beschleunigung</th>
                            <th><Image src={SVG.a} alt="vA" className="absolute z-0"></Image></th>
                            <th>{isError() ? <p className="text-red-500">ERROR</p> : (solveA() ? solveA() : <p className="text-[#0059a9]">{a.toFixed(2).replace(".", ",")} m/s²</p>)}</th>
                            <th><Image src={formA()} alt="vA" className="absolute z-0"></Image></th>
                        </tr>
                        <tr>
                            <th>Beschleunigungsstrecke</th>
                            <th><Image src={SVG.s} alt="vA" className="absolute z-0"></Image></th>
                            <th>{isError() ? <p className="text-red-500">ERROR</p> : (solveS() ? solveS() : <p className="text-[#0059a9]">{s.toFixed(2).replace(".", ",")} m</p>)}</th>
                            <th><Image src={formS()} alt="vA" className="absolute z-0"></Image></th>
                        </tr>
                        <tr>
                            <th>Beschleunigungsdauer</th>
                            <th><Image src={SVG.t} alt="vA" className="absolute z-0"></Image></th>
                            <th>{isError() ? <p className="text-red-500">ERROR</p> : (solveT() ? solveT() : <p className="text-[#0059a9]">{t.toFixed(2).replace(".", ",")} s</p>)}</th>
                            <th><Image src={formT()} alt="vA" className="absolute z-0"></Image></th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ConstAccel