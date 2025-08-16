import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>STEINACKER</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width" />
        <meta name="apple-mobile-web-app-status-bar-style" content="white" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>

      <main>
        <div className="mx-auto max-w-7xl px-4 py-8">

          {/* Maps & Navigation */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-3 h-8 bg-blue-500 rounded-full"></div>
              Maps & Navigation
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <a
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transform"
                href="https://maps.google.de"
                rel="noopener noreferrer"
                target="_blank"
              >
                <h2 className="py-1 text-lg font-semibold text-slate-900 flex items-center gap-2">Google Maps <span className="transition-transform translate-x-0 group-hover:translate-x-0.5">→</span></h2>
                <p className="text-slate-600 leading-relaxed">Karten anzeigen und Routen abrufen</p>
              </a>

              <a
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transform"
                href="https://www.openstreetmap.org/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <h2 className="py-1 text-lg font-semibold text-slate-900 flex items-center gap-2">OpenStreetMap <span className="transition-transform translate-x-0 group-hover:translate-x-0.5">→</span></h2>
                <p className="text-slate-600 leading-relaxed">Karten anzeigen und Routen abrufen</p>
              </a>

              <a
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transform"
                href="https://www.geoportal.rlp.de/mapbender/frames/index.php?gui_id=Geoportal-RLP&zoomToLayer=0"
                rel="noopener noreferrer"
                target="_blank"
              >
                <h2 className="py-1 text-lg font-semibold text-slate-900 flex items-center gap-2">GDI-RP <span className="transition-transform translate-x-0 group-hover:translate-x-0.5">→</span></h2>
                <p className="text-slate-600 leading-relaxed">GEO Portal für Rheinland Pfalz</p>
              </a>

              <a
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transform"
                href="https://www.tim-online.nrw.de/tim-online2/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <h2 className="py-1 text-lg font-semibold text-slate-900 flex items-center gap-2">TIM Online <span className="transition-transform translate-x-0 group-hover:translate-x-0.5">→</span></h2>
                <p className="text-slate-600 leading-relaxed">GEO Portal für Nordrhein Westfalen</p>
              </a>

              <a
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transform"
                href="https://www.google.com/maps/d/viewer?mid=1ecs7MpOBn1O-2OLDH1hVonpIQQk&ll=50.283341968039565%2C7.6348235146059995&z=8"
                rel="noopener noreferrer"
                target="_blank"
              >
                <h2 className="py-1 text-lg font-semibold text-slate-900 flex items-center gap-2">DIE Karte <span className="transition-transform translate-x-0 group-hover:translate-x-0.5">→</span></h2>
                <p className="text-slate-600 leading-relaxed">Google Maps Unfallstellen Karte</p>
              </a>

              <a
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transform"
                href="https://maptool-dipul.dfs.de/?language=de&zoom=11.0"
                rel="noopener noreferrer"
                target="_blank"
              >
                <h2 className="py-1 text-lg font-semibold text-slate-900 flex items-center gap-2">dipul <span className="transition-transform translate-x-0 group-hover:translate-x-0.5">→</span></h2>
                <p className="text-slate-600 leading-relaxed">Drohnen Karte</p>
              </a>
            </div>
          </section>

          {/* Automotive Data & Resources */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-3 h-8 bg-green-500 rounded-full"></div>
              Automotive Data & Resources
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <a
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/25 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 transform"
                href="https://www.ccvision.de/de/car-special-cloud/#index"
                rel="noopener noreferrer"
                target="_blank"
              >
                <h2 className="py-1 text-lg font-semibold text-slate-900 flex items-center gap-2">CC Vision <span className="transition-transform translate-x-0 group-hover:translate-x-0.5">→</span></h2>
                <p className="text-slate-600 leading-relaxed">Creativ Collection Fahrzeugzeichnungen</p>
              </a>

              <a
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/25 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 transform"
                href="https://www.autoscout24.de/auto/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <h2 className="py-1 text-lg font-semibold text-slate-900 flex items-center gap-2">AutoScout24 <span className="transition-transform translate-x-0 group-hover:translate-x-0.5">→</span></h2>
                <p className="text-slate-600 leading-relaxed">Technische Daten</p>
              </a>

              <a
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/25 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 transform"
                href="https://www.carsized.com/de/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <h2 className="py-1 text-lg font-semibold text-slate-900 flex items-center gap-2">carsized <span className="transition-transform translate-x-0 group-hover:translate-x-0.5">→</span></h2>
                <p className="text-slate-600 leading-relaxed">Pkw Perspektive</p>
              </a>

              <a
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/25 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 transform"
                href="https://www.adac.de/verkehr/recht/verkehrszeichen/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <h2 className="py-1 text-lg font-semibold text-slate-900 flex items-center gap-2">ADAC <span className="transition-transform translate-x-0 group-hover:translate-x-0.5">→</span></h2>
                <p className="text-slate-600 leading-relaxed">Verkehrszeichen</p>
              </a>

              <a
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/25 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 transform"
                href="https://app.cardetektiv.de/login"
                rel="noopener noreferrer"
                target="_blank"
              >
                <h2 className="py-1 text-lg font-semibold text-slate-900 flex items-center gap-2">cardetektiv <span className="transition-transform translate-x-0 group-hover:translate-x-0.5">→</span></h2>
                <p className="text-slate-600 leading-relaxed">Wiederbeschaffungswert Preisanalyse</p>
              </a>
            </div>
          </section>

          {/* Crash Testing & Safety */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-3 h-8 bg-red-500 rounded-full"></div>
              Crash Testing & Safety
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <a
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/25 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/40 transform"
                href="https://www.colliseum.eu/wiki/R%C3%B6srather_Crashtage"
                rel="noopener noreferrer"
                target="_blank"
              >
                <h2 className="py-1 text-lg font-semibold text-slate-900 flex items-center gap-2">Crashtests <span className="transition-transform translate-x-0 group-hover:translate-x-0.5">→</span></h2>
                <p className="text-slate-600 leading-relaxed">Colliseum Rösrather Crashtage</p>
              </a>

              <a
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/25 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/40 transform"
                href="https://crashdb.agu.ch/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <h2 className="py-1 text-lg font-semibold text-slate-900 flex items-center gap-2">AGU Zürich <span className="transition-transform translate-x-0 group-hover:translate-x-0.5">→</span></h2>
                <p className="text-slate-600 leading-relaxed">Crashtest Database</p>
              </a>

              <a
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/25 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/40 transform"
                href="https://shop.crashtest-service.com/login"
                rel="noopener noreferrer"
                target="_blank"
              >
                <h2 className="py-1 text-lg font-semibold text-slate-900 flex items-center gap-2">CTS <span className="transition-transform translate-x-0 group-hover:translate-x-0.5">→</span></h2>
                <p className="text-slate-600 leading-relaxed">Crash Test Service Login</p>
              </a>
            </div>
          </section>

          {/* Infrastructure & Traffic */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-3 h-8 bg-purple-500 rounded-full"></div>
              Infrastructure & Traffic
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              <a
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/25 hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transform"
                href="https://www.nwsib-online.nrw.de/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <h2 className="py-1 text-lg font-semibold text-slate-900 flex items-center gap-2">NWSIB <span className="transition-transform translate-x-0 group-hover:translate-x-0.5">→</span></h2>
                <p className="text-slate-600 leading-relaxed">Landesbetrieb Straßenbau NRW</p>
              </a>

              <a
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/25 hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transform"
                href="https://www.mapillary.com/app/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <h2 className="py-1 text-lg font-semibold text-slate-900 flex items-center gap-2">Mapillary <span className="transition-transform translate-x-0 group-hover:translate-x-0.5">→</span></h2>
                <p className="text-slate-600 leading-relaxed">Access street-level imagery</p>
              </a>

              <a
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/25 hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transform"
                href="http://www.autobahnatlas-online.de/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <h2 className="py-1 text-lg font-semibold text-slate-900 flex items-center gap-2">Autobahnatlas <span className="transition-transform translate-x-0 group-hover:translate-x-0.5">→</span></h2>
                <p className="text-slate-600 leading-relaxed">Webseite über das deutsche Autobahnnetz</p>
              </a>
            </div>
          </section>

        </div>

      </main>
    </div>
  )
}

export default Home
