import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import FactureInfo from './other/FactureInfo'

function PageInvoice() {
    const [factures, setFactures] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFactures()
    }, [])

    const fetchFactures = async () => {
        try {
            const response = await fetch('/api/invoices', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            const data = await response.json()
            setFactures(data.invoices || data || [])
        } catch (error) {
            console.error('Erreur lors du chargement des factures:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="text-white">Chargement...</span>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-white">Mes Factures</h1>
                <Link
                    to="/dashboard/generateInvoice"
                    className="w-10 h-10 border-3 border-white rounded-full flex items-center justify-center text-white transition-colors hover:border-gray-300 hover:text-gray-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </Link>
            </div>

            {factures.length === 0 ? (
                <p className="text-gray-400">Aucune facture trouvée.</p>
            ) : (
                factures.map((facture) => (
                    <FactureInfo key={facture.id} facture={facture} />
                ))
            )}
        </div>
    )
}

export default PageInvoice
