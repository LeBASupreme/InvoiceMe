import { useState, useEffect } from 'react'
import PageInvoice from './GestionFacture/PageInvoice.jsx';
import ClientsPage from './GestionClient/ClientsPage.jsx';
import ChatPage from './Chat/ChatPage.jsx';
import DashboardHome from './DashboardHome.jsx';
import SettingsPage from './GestionClient/SettingsPage.jsx';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';

function Dashboard() {
    const [isNavOpen, setIsNavOpen] = useState(false)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsNavOpen(true)
            } else {
                setIsNavOpen(false)
            }
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = async () => {
        const token = localStorage.getItem('token')
        
        // Si pas de token, rediriger vers login
        if (!token) {
            navigate('/login')
            return
        }
        
        try {
            const response = await fetch('/api/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            })
            if (response.ok) {
                const data = await response.json()
                setUser(data.user || data)
            } else {
                localStorage.removeItem('token')
                navigate('/login')
            }
        } catch (err) {
            console.error('Erreur chargement utilisateur:', err)
            navigate('/login')
        } finally {
            setLoading(false)
        }
    }

    const handleNavClick = () => {
        if (window.innerWidth < 1024) {
            setIsNavOpen(false)
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <span className="text-white text-xl">Chargement...</span>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen">
                {isNavOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setIsNavOpen(false)}
                    />
                )}

                <nav className={`fixed top-0 left-0 flex flex-col h-screen w-64 bg-dark-soft text-white border-r border-white z-50 transform transition-transform duration-300 ease-in-out ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="p-4 border-b border-white flex justify-between items-center">
                                <div className="flex items-center gap-3 min-w-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <p className="font-semibold truncate">{user ? `${user.prenom} ${user.nom}` : 'Chargement...'}</p>
                                </div>
                                <button
                                        onClick={() => setIsNavOpen(false)}
                                        className="text-white hover:text-gray-300 p-1"
                                >
                                        ✕
                                </button>
                        </div>

                        <div className="flex-1 pt-8 overflow-y-auto">
                                <ul className="space-y-2">
                                    <Link to="/dashboard/invoice" onClick={handleNavClick}>
                                        <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Facture
                                        </li>
                                    </Link>
                                    <Link to="/dashboard/clients" onClick={handleNavClick}>
                                        <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                Clients
                                        </li>
                                    </Link>
                                    <Link to="/dashboard/chat" onClick={handleNavClick}>
                                        <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                                Assistant IA
                                        </li>
                                    </Link>
                                </ul>
                        </div>
                                
                        <Link to="/dashboard/settings" onClick={handleNavClick}>
                            <div className="p-4 border-t border-gray-700 hover:bg-gray-700 cursor-pointer">
                                    <span className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Paramètres
                                    </span>
                            </div>
                        </Link>
                </nav>
                

                <div className={`flex-1 p-4 md:p-6 transition-all duration-300 ${isNavOpen ? 'lg:ml-64' : ''}`}>
                        <div className="flex items-center gap-4 mb-4 lg:hidden">
                            <button 
                                onClick={() => setIsNavOpen(true)}
                                className="p-2 text-white rounded hover:bg-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <span className="text-white font-semibold">InvoiceMe</span>
                        </div>

                        {!isNavOpen && (
                            <button 
                                onClick={() => setIsNavOpen(true)}
                                className="hidden lg:flex mb-4 p-2 text-white rounded hover:bg-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        )}

                       <Routes>
                                <Route path="/" element={<DashboardHome />} />
                                <Route path="invoice" element={<PageInvoice />} />
                                <Route path="clients" element={<ClientsPage />} />
                                <Route path="chat" element={<ChatPage />} />
                                <Route path="settings" element={<SettingsPage />} />
                       </Routes>
                </div>
        </div>
    )
}

export default Dashboard