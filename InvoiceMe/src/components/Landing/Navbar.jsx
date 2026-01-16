import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navRef = useRef(null)
  const logoRef = useRef(null)
  const linksRef = useRef(null)
  const buttonsRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.fromTo(navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }
    )
    .fromTo(logoRef.current,
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.6 },
      '-=0.4'
    )
    .fromTo(linksRef.current?.children || [],
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 },
      '-=0.3'
    )
    .fromTo(buttonsRef.current?.children || [],
      { x: 20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, stagger: 0.15 },
      '-=0.4'
    )
  }, [])

  return (
    <nav ref={navRef} className="fixed top-0 left-0 w-full px-6 lg:px-12 py-4 bg-dark z-50 opacity-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">
            <Link to="/" className="flex items-center">
                <div ref={logoRef} className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
            </Link>

            <div className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
                <ul ref={linksRef} className="flex items-center gap-8 text-white">
                    <li><a href="#product" className="hover:text-gray-300 transition-colors">Product</a></li>
                    <li><a href="#features" className="hover:text-gray-300 transition-colors">Features</a></li>
                    <li><a href="#pricing" className="hover:text-gray-300 transition-colors">Pricing</a></li>
                </ul>
            </div>

            <div ref={buttonsRef} className="hidden md:flex items-center gap-4 ml-auto">
                <Link
                    to="/login"
                    className="px-6 py-2 border border-white text-white rounded-full hover:bg-white hover:text-dark transition-colors"
                >
                    Sign in
                </Link>
                <Link
                    to="/register"
                    className="px-6 py-2 bg-white text-dark rounded-full hover:bg-gray-200 transition-colors font-medium"
                >
                    Get started
                </Link>
            </div>


            <button
                className="md:hidden text-white p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>
        </div>


        {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-700">
                <ul className="flex flex-col gap-4 text-white pt-4">
                    <li><a href="#product" className="block py-2 hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Product</a></li>
                    <li><a href="#features" className="block py-2 hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Features</a></li>
                    <li><a href="#pricing" className="block py-2 hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Pricing</a></li>
                </ul>
                <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-700">
                    <Link
                        to="/login"
                        className="px-6 py-2 border border-white text-white rounded-full text-center hover:bg-white hover:text-dark transition-colors"
                    >
                        Sign in
                    </Link>
                    <Link
                        to="/register"
                        className="px-6 py-2 bg-white text-dark rounded-full text-center hover:bg-gray-200 transition-colors font-medium"
                    >
                        Get started
                    </Link>
                </div>
            </div>
        )}
    </nav>
  )
}

export default Navbar