
import { useState } from "react";
import Image from 'next/image'
import Head from 'next/head'
import SVG from '../assets/svg'

function VMT() {
    const [s, sSet] = useState<number>(NaN)
    const [sR, sRSet] = useState<number>(NaN)
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

        <div className="grid xl:grid-cols-2 m-0 gap-5 p-4">
            <Head>
                <title>VMT | ESO</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width" />
            </Head>


            <div className="flex  bg-[#0059a9] border-[1.25rem] border-[#0059a9] rounded-xl">
                <h1 className="pr-4 text-center text-[#fff] self-center">ESO</h1>
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

            <div className="flex  bg-[#0059a9] border-[1.25rem] border-[#0059a9] rounded-xl">
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

            <div className="flex  bg-[#0059a9] border-[1.25rem] border-[#0059a9] rounded-xl">
                <h1 className="pr-4 text-center text-[#fff] self-center">Riegl</h1>
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

            <div className="flex  bg-[#0059a9] border-[1.25rem] border-[#0059a9] rounded-xl">
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
    )
}

export default VMT