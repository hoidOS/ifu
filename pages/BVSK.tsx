import Head from 'next/head'
import NavEval from './NavEval'

function BVSK() {
  return (
    <div className="grid gap-6 mx-auto max-w-7xl px-4 py-8">
      <Head>
        <title>Minderwert | BVSK</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200 bg-white">
        <div className="bg-[#0059a9] text-white px-6 py-3">
          <h2 className="text-lg font-semibold">BVSK</h2>
        </div>
        <div className="p-6">
          <p className="text-slate-700">Inhalt folgt.</p>
        </div>
      </div>

      <NavEval />
    </div>
  )
}

export default BVSK

