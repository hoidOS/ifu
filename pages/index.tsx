import type { NextPage } from 'next'
import Head from 'next/head'

type Accent = 'blue' | 'green' | 'red' | 'purple'

interface ResourceLink {
  title: string
  description: string
  href: string
}

interface ResourceSection {
  id: string
  title: string
  accent: Accent
  links: ResourceLink[]
}

const BASE_CARD_CLASSES =
  'group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] transform focus:outline-none focus:ring-2'

const ACCENT_CLASSES: Record<Accent, string> = {
  blue: 'hover:shadow-2xl hover:shadow-blue-500/25 hover:border-blue-300 focus:ring-blue-500/40',
  green: 'hover:shadow-2xl hover:shadow-green-500/25 hover:border-green-300 focus:ring-green-500/40',
  red: 'hover:shadow-2xl hover:shadow-red-500/25 hover:border-red-300 focus:ring-red-500/40',
  purple: 'hover:shadow-2xl hover:shadow-purple-500/25 hover:border-purple-300 focus:ring-purple-500/40',
}

const ACCENT_BAR_CLASSES: Record<Accent, string> = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
}

const RESOURCE_SECTIONS: ResourceSection[] = [
  {
    id: 'maps-navigation',
    title: 'Maps & Navigation',
    accent: 'blue',
    links: [
      {
        title: 'Google Maps',
        description: 'Karten anzeigen und Routen abrufen',
        href: 'https://maps.google.de',
      },
      {
        title: 'OpenStreetMap',
        description: 'Karten anzeigen und Routen abrufen',
        href: 'https://www.openstreetmap.org/',
      },
      {
        title: 'GDI-RP',
        description: 'GEO Portal für Rheinland Pfalz',
        href: 'https://www.geoportal.rlp.de/mapbender/frames/index.php?gui_id=Geoportal-RLP&zoomToLayer=0',
      },
      {
        title: 'TIM Online',
        description: 'GEO Portal für Nordrhein Westfalen',
        href: 'https://www.tim-online.nrw.de/tim-online2/',
      },
      {
        title: 'DIE Karte',
        description: 'Google Maps Unfallstellen Karte',
        href: 'https://www.google.com/maps/d/viewer?mid=1ecs7MpOBn1O-2OLDH1hVonpIQQk&ll=50.283341968039565%2C7.6348235146059995&z=8',
      },
      {
        title: 'dipul',
        description: 'Drohnen Karte',
        href: 'https://maptool-dipul.dfs.de/?language=de&zoom=11.0',
      },
    ],
  },
  {
    id: 'automotive-data',
    title: 'Automotive Data & Resources',
    accent: 'green',
    links: [
      {
        title: 'CC Vision',
        description: 'Creativ Collection Fahrzeugzeichnungen',
        href: 'https://www.ccvision.de/de/car-special-cloud/#index',
      },
      {
        title: 'AutoScout24',
        description: 'Technische Daten',
        href: 'https://www.autoscout24.de/auto/',
      },
      {
        title: 'carsized',
        description: 'Pkw Perspektive',
        href: 'https://www.carsized.com/de/',
      },
      {
        title: 'ADAC',
        description: 'Verkehrszeichen',
        href: 'https://www.adac.de/verkehr/recht/verkehrszeichen/',
      },
      {
        title: 'cardetektiv',
        description: 'Wiederbeschaffungswert Preisanalyse',
        href: 'https://app.cardetektiv.de/login',
      },
      {
        title: 'DAT',
        description: 'Reparaturkostenkalkulation',
        href: 'https://www.dat.de/reparaturkostenkalkulation/',
      },
    ],
  },
  {
    id: 'crash-testing',
    title: 'Crash Testing & Safety',
    accent: 'red',
    links: [
      {
        title: 'Crashtests',
        description: 'Colliseum Rösrather Crashtage',
        href: 'https://www.colliseum.eu/wiki/R%C3%B6srather_Crashtage',
      },
      {
        title: 'AGU Zürich',
        description: 'Crashtest Database',
        href: 'https://crashdb.agu.ch/',
      },
      {
        title: 'CTS',
        description: 'Crash Test Service Login',
        href: 'https://shop.crashtest-service.com/login',
      },
    ],
  },
  {
    id: 'infrastructure-traffic',
    title: 'Infrastructure & Traffic',
    accent: 'purple',
    links: [
      {
        title: 'NWSIB',
        description: 'Landesbetrieb Straßenbau NRW',
        href: 'https://www.nwsib-online.nrw.de/',
      },
      {
        title: 'Mapillary',
        description: 'Access street-level imagery',
        href: 'https://www.mapillary.com/app/',
      },
      {
        title: 'Autobahnatlas',
        description: 'Webseite über das deutsche Autobahnnetz',
        href: 'http://www.autobahnatlas-online.de/',
      },
    ],
  },
]

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
          {RESOURCE_SECTIONS.map((section) => (
            <section key={section.id} className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className={`w-3 h-8 rounded-full ${ACCENT_BAR_CLASSES[section.accent]}`}></div>
                {section.title}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.links.map((link) => (
                  <a
                    key={link.href}
                    className={`${BASE_CARD_CLASSES} ${ACCENT_CLASSES[section.accent]}`}
                    href={link.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <h3 className="py-1 text-lg font-semibold text-slate-900 flex items-center gap-2">
                      {link.title}
                      <span className="transition-transform translate-x-0 group-hover:translate-x-0.5" aria-hidden="true">
                        →
                      </span>
                    </h3>
                    <p className="text-slate-600 leading-relaxed">{link.description}</p>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home
