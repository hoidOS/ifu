
import * as util from '../../components/utilConst'
import { useState } from "react";
import Image from 'next/image'
import SVG from '../../assets/svg'


function ConstAccel() {
    const [v, setV] = useState<number>(NaN)
    const [s, setS] = useState<number>(NaN)
    const [t, setT] = useState<number>(NaN)

    const vIsSet = v >= 0 || !isNaN
    const sIsSet = s >= 0 || !isNaN
    const tIsSet = t >= 0 || !isNaN

    const vO = util.getSpeed(s, t)
    const sO = util.getDistance(v, t)
    const tO = util.getTime(s, v)

    return (
        <>
            <div className="flex  bg-[#0059a9] border-[1.25rem] border-[#0059a9] rounded-xl">
                <h1 className="pr-4 text-center text-[#fff] self-center">Konstantfahrt</h1>
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
        </>
    )
}

export default ConstAccel