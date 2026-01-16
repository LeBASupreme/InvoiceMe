import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ClientInfo from './other/ClientInfo'

function ClientsPage() {
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchClients()
    }, [])

    const fetchClients = async () => {
        try {
            const response = await fetch('/api/clients', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            const data = await response.json()
            setClients(data.clients || data || [])
        } catch (error) {
            console.error('Erreur lors du chargement des clients:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteClient = (clientId) => {
        setClients(clients.filter(c => c.id !== clientId))
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
                <h1 className="text-2xl font-bold text-white">Mes Clients</h1>
                <Link
                    to="/add-client"
                    className="w-10 h-10 border-3 border-white rounded-full flex items-center justify-center text-white transition-colors hover:border-gray-300 hover:text-gray-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </Link>
            </div>

            {clients.length === 0 ? (
                <p className="text-gray-400">Aucun client trouvé.</p>
            ) : (
                clients.map((client) => (
                    <ClientInfo key={client.id} client={client} onDelete={handleDeleteClient} />
                ))
            )}
        </div>
    )
}

export default ClientsPage
