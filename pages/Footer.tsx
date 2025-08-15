function Footer() {
    return (
        <footer className="mt-12 border-t border-slate-200 bg-white/60 backdrop-blur py-6 text-sm text-slate-500">
            <div className="mx-auto max-w-7xl px-4 flex items-center justify-center">
                <p>&copy; {new Date().getFullYear()} STEINACKER</p>
            </div>
        </footer>
    )
}

export default Footer
