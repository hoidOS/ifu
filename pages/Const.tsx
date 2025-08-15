import Head from 'next/head'
import ConstDecl from './Const/ConstDecel'
import ConstAccel from './Const/ConstAccel'
import ConstDrive from './Const/ConstDrive'

function Konst() {

    return (

        <div className="grid xl:grid-cols-2 m-0 gap-5 p-4">
            <Head>
                <title>PPCAVS | Konstantfahrt</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width" />
            </Head>

            <ConstDecl />

            <ConstAccel />

            <ConstDrive />

        </div>
    )
}

export default Konst