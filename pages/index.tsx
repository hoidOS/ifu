import type { NextPage } from 'next'
import Link from 'next/link';
import Head from 'next/head'
import Image from 'next/image'

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

          <div className="grid grid-cols-1 p-8 gap-6 m-2 max-w-8xl mx-auto xl:grid-cols-5 lg:grid-cols-3 md:m-20 sm:grid-cols-2">
            <a
              className="text-gray-900 border border-gray-300 m-0 p-6 text-left shadow-lg rounded-xl hover:border-[#0059a9] hover:text-[#0059a9] hover:bg-gray-100 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:ring-offset-2"
              href="https://www.ccvision.de/de/car-special-cloud/#index"
              rel="noopener noreferrer"
              target="_blank"
            >
              <h1 className="py-1 text-xl font-bold">CC Vision →</h1>
              <p className="text-lg leading-relaxed">Creativ Collection Fahrzeugzeichnungen</p>
            </a>

            <a
              className="text-gray-900 border border-gray-300 m-0 p-6 text-left shadow-lg rounded-xl hover:border-[#0059a9] hover:text-[#0059a9] hover:bg-gray-100 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:ring-offset-2"
              href="https://maps.google.de"
              rel="noopener noreferrer"
              target="_blank"
            >
              <h1 className="py-1 text-xl font-bold">Google Maps →</h1>
              <p className="text-lg leading-relaxed">Karten anzeigen und Routen abrufen</p>
            </a>

            <a
              className="text-gray-900 border border-gray-300 m-0 p-6 text-left shadow-lg rounded-xl hover:border-[#0059a9] hover:text-[#0059a9] hover:bg-gray-100 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:ring-offset-2"
              href="https://www.openstreetmap.org/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <h1 className="py-1 text-xl font-bold">OpenStreetMap →</h1>
              <p className="text-lg leading-relaxed">Karten anzeigen und Routen abrufen</p>
            </a>

            <a
              className="text-gray-900 border border-gray-300 m-0 p-6 text-left shadow-lg rounded-xl hover:border-[#0059a9] hover:text-[#0059a9] hover:bg-gray-100 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:ring-offset-2"
              href="https://www.geoportal.rlp.de/mapbender/frames/index.php?gui_id=Geoportal-RLP&zoomToLayer=0"
              rel="noopener noreferrer"
              target="_blank"
            >
              <h1 className="py-1 text-xl font-bold">GDI-RP →</h1>
              <p className="text-lg leading-relaxed">GEO Portal für Rheinland Pfalz</p>
            </a>

            <a
              className="text-gray-900 border border-gray-300 m-0 p-6 text-left shadow-lg rounded-xl hover:border-[#0059a9] hover:text-[#0059a9] hover:bg-gray-100 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:ring-offset-2"
              href="https://www.tim-online.nrw.de/tim-online2/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <h1 className="py-1 text-xl font-bold">TIM Online →</h1>
              <p className="text-lg leading-relaxed">GEO Portal für Nordrhein Westfalen</p>
            </a>

            <a
              className="text-gray-900 border border-gray-300 m-0 p-6 text-left shadow-lg rounded-xl hover:border-[#0059a9] hover:text-[#0059a9] hover:bg-gray-100 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:ring-offset-2"
              href="https://www.google.com/maps/d/viewer?mid=1ecs7MpOBn1O-2OLDH1hVonpIQQk&ll=50.283341968039565%2C7.6348235146059995&z=8"
              rel="noopener noreferrer"
              target="_blank"
            >
              <h1 className="py-1 text-xl font-bold">DIE Karte →</h1>
              <p className="text-lg leading-relaxed">Google Maps Unfallstellen Karte</p>
            </a>

            <a
              className="text-gray-900 border border-gray-300 m-0 p-6 text-left shadow-lg rounded-xl hover:border-[#0059a9] hover:text-[#0059a9] hover:bg-gray-100 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:ring-offset-2"
              href="https://maptool-dipul.dfs.de/?language=de&zoom=11.0"
              rel="noopener noreferrer"
              target="_blank"
            >
              <h1 className="py-1 text-xl font-bold">dipul →</h1>
              <p className="text-lg leading-relaxed">Drohnen Karte</p>
            </a>

            <a
              className="text-gray-900 border border-gray-300 m-0 p-6 text-left shadow-lg rounded-xl hover:border-[#0059a9] hover:text-[#0059a9] hover:bg-gray-100 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:ring-offset-2"
              href="https://www.nwsib-online.nrw.de/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <h1 className="py-1 text-xl font-bold">NWSIB →</h1>
              <p className="text-lg leading-relaxed">Landesbetrieb Straßenbau NRW</p>
            </a>

            <a
              className="text-gray-900 border border-gray-300 m-0 p-6 text-left shadow-lg rounded-xl hover:border-[#0059a9] hover:text-[#0059a9] hover:bg-gray-100 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:ring-offset-2"
              href="https://www.mapillary.com/app/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <h1 className="py-1 text-xl font-bold">Mapillary →</h1>
              <p className="text-lg leading-relaxed">Access street-level imagery</p>
            </a>

            <a
              className="text-gray-900 border border-gray-300 m-0 p-6 text-left shadow-lg rounded-xl hover:border-[#0059a9] hover:text-[#0059a9] hover:bg-gray-100 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:ring-offset-2"
              href="http://www.autobahnatlas-online.de/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <h1 className="py-1 text-xl font-bold">Autobahnatlas →</h1>
              <p className="text-lg leading-relaxed">Webseite über das deutsche Autobahnnetz</p>
            </a>

            <a
              className="text-gray-900 border border-gray-300 m-0 p-6 text-left shadow-lg rounded-xl hover:border-[#0059a9] hover:text-[#0059a9] hover:bg-gray-100 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:ring-offset-2"
              href="https://www.colliseum.eu/wiki/R%C3%B6srather_Crashtage"
              rel="noopener noreferrer"
              target="_blank"
            >
              <h1 className="py-1 text-xl font-bold">Crashtests →</h1>
              <p className="text-lg leading-relaxed">Colliseum Rösrather Crashtage</p>
            </a>

            <a
              className="text-gray-900 border border-gray-300 m-0 p-6 text-left shadow-lg rounded-xl hover:border-[#0059a9] hover:text-[#0059a9] hover:bg-gray-100 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:ring-offset-2"
              href="https://crashdb.agu.ch/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <h1 className="py-1 text-xl font-bold">AGU Zürich →</h1>
              <p className="text-lg leading-relaxed">Crashtest Database</p>
            </a>

            <a
              className="text-gray-900 border border-gray-300 m-0 p-6 text-left shadow-lg rounded-xl hover:border-[#0059a9] hover:text-[#0059a9] hover:bg-gray-100 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:ring-offset-2"
              href="https://shop.crashtest-service.com/login"
              rel="noopener noreferrer"
              target="_blank"
            >
              <h1 className="py-1 text-xl font-bold">CTS →</h1>
              <p className="text-lg leading-relaxed">Crash Test Service Login</p>
            </a>

            <a
              className="text-gray-900 border border-gray-300 m-0 p-6 text-left shadow-lg rounded-xl hover:border-[#0059a9] hover:text-[#0059a9] hover:bg-gray-100 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:ring-offset-2"
              href="https://www.carsized.com/de/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <h1 className="py-1 text-xl font-bold">carsized →</h1>
              <p className="text-lg leading-relaxed">Pkw Perspektive</p>
            </a>

            <a
              className="text-gray-900 border border-gray-300 m-0 p-6 text-left shadow-lg rounded-xl hover:border-[#0059a9] hover:text-[#0059a9] hover:bg-gray-100 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:ring-offset-2"
              href="https://www.adac.de/verkehr/recht/verkehrszeichen/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <h1 className="py-1 text-xl font-bold">ADAC →</h1>
              <p className="text-lg leading-relaxed">Verkehrszeichen</p>
            </a>

            <a
              className="text-gray-900 border border-gray-300 m-0 p-6 text-left shadow-lg rounded-xl hover:border-[#0059a9] hover:text-[#0059a9] hover:bg-gray-100 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0059a9] focus:ring-offset-2"
              href="https://www.autoscout24.de/auto/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <h1 className="py-1 text-xl font-bold">AutoScout24 →</h1>
              <p className="text-lg leading-relaxed">Technische Daten</p>
            </a>


        </div>

      </main>
    </div>
  )
}

export default Home
