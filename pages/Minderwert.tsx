import Head from 'next/head'
import { useState } from 'react'
import NavEval from './NavEval';

function Minderwert() {

    const [a, aset] = useState<number>(NaN)



    return (
        <>
            <div className="grid gap-6 mx-auto max-w-7xl px-4 py-8 md:grid-cols-2">
                <Head>
                    <title>Minderwert</title>
                    <link rel="icon" href="/favicon.ico" />
                    <meta name="viewport" content="width=device-width" />
                </Head>


                {/* MW = [  (VW / 100) + (VW / NP * RK * SU *AK)  ] * FM * FV */}




                <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
                    <div className="bg-[#0059a9] text-white px-6 py-3">
                        <h2 className="text-lg font-semibold">BVSK</h2>
                    </div>
                    <div className="p-6">
                    <table>
                        <tbody>
                            <tr>
                                <th>Vorgabe</th>
                                <th>Eingabe</th>
                                <th>Info</th>
                            </tr>
                            <tr>
                                <th>Intensität</th>
                                <th>
                                    <div>
                                        <input type="number" placeholder="v in km/h" defaultValue={''} onWheel={e => e.currentTarget.blur()} onChange={(e) => aset(e.target.valueAsNumber)} />
                                    </div>
                                </th>
                                <th>


                                </th>
                            </tr>
                            <tr>
                                <th>Vorschaden</th>
                                <th>
                                    <div>
                                        <input type="number" placeholder="0.0 - 1.0" defaultValue={''} onWheel={e => e.currentTarget.blur()} onChange={(e) => aset(e.target.valueAsNumber)} />
                                    </div>
                                </th>
                                <th>TEST</th>
                            </tr>
                            <tr>
                                <th>Marktgängigkeit</th>
                                <th>
                                    <div>
                                        <input type="number" placeholder="-0.5% - 2.0%" defaultValue={''} onWheel={e => e.currentTarget.blur()} onChange={(e) => aset(e.target.valueAsNumber)} />
                                    </div>
                                </th>
                                <th>TEST</th>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                </div>

                <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
                    <div className="bg-[#0059a9] text-white px-6 py-3">
                        <h2 className="text-lg font-semibold">MFM</h2>
                    </div>
                    <div className="p-6">
                    <table>
                        <tbody>
                            <tr>
                                <th>Vorgabe</th>
                                <th>Eingabe</th>
                                <th>Info</th>
                            </tr>
                            <tr>
                                <th>Intensität</th>
                                <th>
                                    <div>
                                        <input type="number" placeholder="0.2 - 1.0" defaultValue={''} onWheel={e => e.currentTarget.blur()} onChange={(e) => aset(e.target.valueAsNumber)} />
                                    </div>
                                </th>
                                <th>
                                    <table>
                                        <tbody className='text-sm font-light'>
                                            <tr>
                                                <th>0,2</th>
                                                <td>
                                                    Erneuerung und/oder Instandsetzung von Anbauteilen (z.B.
                                                    Stoßfänger)
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>0,4</th>
                                                <td>
                                                    Erneuerung und/oder Instandsetzung von ‚geschraubten‘
                                                    Karosserieteilen (z.B. Tür, Motorhaube, Kotflügel)
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>0,6</th>
                                                <td>
                                                    Geringe Instandsetzungsarbeiten von tragenden oder mittragenden
                                                    Karosserieteilen (z.B. Seitenwand instand setzen, Heckblech
                                                    instand setzen)
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>0,8</th>
                                                <td>
                                                    Erhebliche Instandsetzungsarbeiten und/oder Erneuerung von
                                                    tragenden oder mittragenden Karosserieteilen (z.B. Kofferboden
                                                    instand setzen, Seitenwand erneuern)
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>1,0</th>
                                                <td>
                                                    Erneuerung und/oder erhebliche Instandsetzung (Richtbank
                                                    erforderlich) von tragenden Karosserieteilen (z.B. Längsträger
                                                    instand setzen, Rohbaukarosse)
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </th>
                            </tr>

                            <tr>
                                <th>Vorschaden</th>
                                <th>
                                    <div>
                                        <input type="number" placeholder="0.2 - 1.0" defaultValue={''} onWheel={e => e.currentTarget.blur()} onChange={(e) => aset(e.target.valueAsNumber)} />
                                    </div>
                                </th>
                                <th></th>
                            </tr>
                            <tr>
                                <th>Marktgängigkeit</th>
                                <th>
                                    <div>
                                        <input type="number" placeholder="0.6 - 1.4" defaultValue={''} onWheel={e => e.currentTarget.blur()} onChange={(e) => aset(e.target.valueAsNumber)} />
                                    </div>
                                </th>
                                <th></th>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
                <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
                    <div className="bg-[#0059a9] text-white px-6 py-3">
                        <h2 className="text-lg font-semibold">Berechnung</h2>
                    </div>
                    <div className="p-6">
                    <table>
                        <tbody>
                            <tr>
                                <th>Berechnung</th>
                                <th><span className="text-[#0059a9]">Ein</span> / Ausgabe</th>
                                <th>Formel</th>
                            </tr>
                            <tr>
                                <th>Anfangsgeschwindigkeit</th>
                                <th></th>
                                <th></th>
                            </tr>
                            <tr>
                                <th>Endgeschwindigkeit</th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                            <tr>
                                <th>Verzögerung</th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                            <tr>
                                <th>Verzögerungsstrecke</th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                            <tr>
                                <th>Verzögerungsdauer</th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                </div>

                <NavEval />
            </div>
        </>

    )
}

export default Minderwert
