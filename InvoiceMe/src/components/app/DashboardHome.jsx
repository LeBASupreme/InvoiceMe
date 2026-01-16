import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function DashboardHome() {
    const [stats, setStats] = useState({
        totalInvoices: 0,
        totalRevenue: 0,
    })
    const [recentClients, setRecentClients] = useState([])
    const [recentInvoices, setRecentInvoices] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const token = localStorage.getItem('token')
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        }

        try {
            const [invoicesRes, clientsRes] = await Promise.all([
                fetch('/api/invoices', { headers }),
                fetch('/api/clients', { headers }),
            ])

            if (invoicesRes.ok) {
                const invoicesData = await invoicesRes.json()
                const invoices = invoicesData.data || invoicesData || []

                const totalRevenue = invoices.reduce((sum, inv) => sum + parseFloat(inv.total || 0), 0)

                setStats({
                    totalInvoices: invoices.length,
                    totalRevenue: totalRevenue,
                })

                setRecentInvoices(invoices.slice(0, 5))
            }

            if (clientsRes.ok) {
                const clientsData = await clientsRes.json()
                const clients = clientsData.data || clientsData || []

                setRecentClients(clients.slice(0, 3))
            }
        } catch (err) {
            console.error('Erreur chargement données:', err)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
        }).format(amount)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <span className="text-white">Chargement...</span>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Tableau de bord</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-dark-light rounded-xl p-6  ">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Total Factures</p>
                            <p className="text-3xl md:text-4xl font-bold text-white">{stats.totalInvoices}</p>
                        </div>
                        <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-dark-light rounded-xl p-6 ">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Chiffre d'affaires</p>
                            <p className="text-3xl md:text-4xl font-bold text-green-400">{formatCurrency(stats.totalRevenue)}</p>
                        </div>
                        <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-dark-light rounded-xl ">
                    <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">Derniers Clients</h2>
                        <Link to="/dashboard/clients" className="text-blue-400 hover:text-blue-300 text-sm">
                            Voir tout
                        </Link>
                    </div>
                    <div className="p-4">
                        {recentClients.length === 0 ? (
                            <p className="text-gray-400 text-center py-4">Aucun client</p>
                        ) : (
                            <div className="space-y-3">
                                {recentClients.map((client) => (
                                    <div key={client.id} className="flex items-center gap-4 p-3 bg-dark rounded-lg">
                                        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-white font-semibold">
                                                {client.nom?.charAt(0).toUpperCase() || '?'}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium truncate">{client.nom}</p>
                                            <p className="text-gray-400 text-sm truncate">{client.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-dark-light rounded-xl ">
                    <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">Dernières Factures</h2>
                        <Link to="/dashboard/invoice" className="text-blue-400 hover:text-blue-300 text-sm">
                            Voir tout
                        </Link>
                    </div>
                    <div className="p-4">
                        {recentInvoices.length === 0 ? (
                            <p className="text-gray-400 text-center py-4">Aucune facture</p>
                        ) : (
                            <div className="space-y-3">
                                {recentInvoices.map((invoice) => (
                                    <div key={invoice.id} className="flex items-center justify-between p-3 bg-dark rounded-lg">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium truncate">
                                                {invoice.numero || `#${invoice.id}`}
                                            </p>
                                            <p className="text-gray-400 text-sm truncate">
                                                {invoice.client?.nom || 'Client inconnu'}
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0 ml-4">
                                            <p className="text-green-400 font-semibold">
                                                {formatCurrency(invoice.total || 0)}
                                            </p>
                                            <p className="text-gray-400 text-xs">
                                                {formatDate(invoice.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardHome