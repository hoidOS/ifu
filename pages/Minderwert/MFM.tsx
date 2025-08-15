import Link from "next/link";
import NavEval from '../NavEval';
import Params from './MFM/Params';
import SU from './MFM/SU';

function MFM() {
    return (
        <div className="grid p-2 lg:p-10">
            <div className="flex justify-center text-white p-8 mb-4 bg-[#34495e] text-center rounded-xl">
                <h1>Marktrelevanz- und Faktorenmethode MFM</h1>
            </div>
            <div className="grid justify-end m-auto max-w-4xl bg-white border-2 border-solid rounded-xl border-[#ccc] shadow-xl">
                <div className="m-2 px-4 pt-2 text-justify">
                    Berechnung merkantiler Minderwert gemäß der Marktrelevanz- und
                    Faktorenmethode (MFM), Dipl. Ing. Helmut Zeisberger, 2012.
                </div>
                <div className="m-2 px-4 text-justify">
                    Mit der
                    Marktrelevanz- und Faktorenmethode (MFM) wird eine zeitgemäße Methode
                    zur rechnerischen Unterstützung bei der Ermittlung des merkantilen
                    Minderwerts vorgestellt. Die MFM berücksichtigt sowohl rechtliche als
                    auch technische Gegebenheiten. Dabei werden mögliche
                    Marktveränderungen ebenso wie Fahrzeugbesonderheiten und
                    fortschreitende technische Entwicklungen berücksichtigt.
                </div>

                <Params />
                <SU />

            </div>

            <NavEval />
        </div>
    );
}

export default MFM;
