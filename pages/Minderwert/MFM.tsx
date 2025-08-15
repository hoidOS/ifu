import Head from 'next/head'
import NavEval from '../NavEval';
import Params from './MFM/Params';
import SU from './MFM/SU';

function MFM() {
    return (
        <div className="grid gap-6 mx-auto max-w-7xl px-4 py-8">
            <Head>
                <title>Minderwert | MFM</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
                <div className="bg-[#0059a9] text-white px-6 py-3">
                    <h2 className="text-lg font-semibold">Marktrelevanz- und Faktorenmethode (MFM)</h2>
                </div>
                <div className="p-6 space-y-3 text-justify">
                    <p>
                        Berechnung merkantiler Minderwert gemäß der Marktrelevanz- und Faktorenmethode (MFM), Dipl. Ing. Helmut
                        Zeisberger, 2012.
                    </p>
                    <p>
                        Mit der Marktrelevanz- und Faktorenmethode (MFM) wird eine zeitgemäße Methode zur rechnerischen Unterstützung
                        bei der Ermittlung des merkantilen Minderwerts vorgestellt. Die MFM berücksichtigt sowohl rechtliche als auch
                        technische Gegebenheiten. Dabei werden mögliche Marktveränderungen ebenso wie Fahrzeugbesonderheiten und
                        fortschreitende technische Entwicklungen berücksichtigt.
                    </p>
                </div>
            </div>

            <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
                <div className="bg-[#0059a9] text-white px-6 py-3">
                    <h2 className="text-lg font-semibold">Parameter</h2>
                </div>
                <div className="p-6">
                    <Params />
                </div>
            </div>

            <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
                <div className="bg-[#0059a9] text-white px-6 py-3">
                    <h2 className="text-lg font-semibold">SU-Faktor</h2>
                </div>
                <div className="p-6">
                    <SU />
                </div>
            </div>

            <NavEval />
        </div>
    );
}

export default MFM;
