import Head from 'next/head'
import ConstDecel from './const-decel'
import ConstAccel from './const-accel'
import ConstDrive from './const-drive'

function Konst() {

    return (

        <div className="grid gap-6 mx-auto max-w-7xl px-4 py-8 xl:grid-cols-2">
            <Head>
                <title>PPCAVS | Konstantfahrt</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width" />
            </Head>

            <ConstDecel />

            <ConstAccel />

            <ConstDrive />

        </div>
    )
}

export default Konst
