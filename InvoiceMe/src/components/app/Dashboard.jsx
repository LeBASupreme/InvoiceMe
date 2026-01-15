import React from 'react'
import PageInvoice from './GestionFacture/PageInvoice.jsx';
import ClientsPage from './GestionClient/ClientsPage.jsx';
import { Route, Routes, Link } from 'react-router-dom';

function Dashboard() {
const [isNavOpen, setIsNavOpen] = React.useState(true)

    return (
        <div className="flex">
                {isNavOpen && (
                        <nav className="flex flex-col h-screen w-64 bg-dark-soft text-white border-r border-white">
                                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                                        <p className="font-semibold">John Doe</p>
                                        <button 
                                                onClick={() => setIsNavOpen(false)}
                                                className="text-white hover:text-gray-300"
                                        >
                                                ✕
                                        </button>
                                </div>
                                
                                <div className="flex-1 py-4">
                                        <ul className="space-y-2">
                                            <Link to="/dashboard/invoice">
                                                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center">
                                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                                        Facture
                                                </li>
                                            </Link>
                                            <Link to="/dashboard/clients">
                                                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center">
                                                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                                                        Clients
                                                </li>
                                            </Link>
        
                                        </ul>
                                </div>
                                
                                <div className="p-4 border-t border-gray-700 hover:bg-gray-700 cursor-pointer">
                                        <span className="flex items-center">
                                                ⚙️ Paramètres
                                        </span>
                                </div>
                        </nav>
                )}
                
                <div className="flex-1 p-6">
                        {!isNavOpen && (
                                <button 
                                        onClick={() => setIsNavOpen(true)}
                                        className="mb-4 px-4 py-2 bg-dark-soft text-white rounded hover:bg-gray-700"
                                >
                                        ☰ Menu
                                </button>
                        )}
                       


                       <Routes>
                                <Route path="/" element={<h1 className="text-2xl font-bold">Bienvenue sur le tableau de bord</h1>} />
                                <Route path="invoice" element={<PageInvoice />} />
                                <Route path="clients" element={<ClientsPage />} />
                       </Routes>
                </div>
        </div>
    )
}

export default Dashboard