import Footer from './Footer'
import Navbar from './Navbar'
import React from 'react'

type LayoutProps = {
    children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {

    return (
        <>
            <Navbar />
                <main>{children}</main>
            <Footer />
        </>
    )
}

export default Layout