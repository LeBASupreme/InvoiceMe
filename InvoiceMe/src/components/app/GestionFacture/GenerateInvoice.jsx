import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function GenerateInvoice() {
    const navigate = useNavigate()
    const [clientId, setClientId] = useState('')
    const [title, setTitle] = useState('')
    const [dateOfIssue, setDateOfIssue] = useState('')
    const [dueDate, setDueDate] = useState('')

    const [items, setItems] = useState([
        { nom: '', description: '', quantite: 1, prix_unitaire: 0 }
    ])

    const [clients, setClients] = useState([])

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchClients()
    }, [])

    const fetchClients = async () => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch('/api/clients', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            })
            const data = await response.json()
            if (response.ok) {
                setClients(data.clients || [])
            }
        } catch (err) {
            console.error('Erreur chargement clients:', err)
        }
    }

    const addItem = () => {
        setItems([...items, { nom: '', description: '', quantite: 1, prix_unitaire: 0 }])
    }

    const removeItem = (index) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index))
        }
    }

    const updateItem = (index, field, value) => {
        const newItems = [...items]
        newItems[index][field] = value
        setItems(newItems)
    }

    const calculateTotal = () => {
        return items.reduce((sum, item) => {
            return sum + (item.quantite * item.prix_unitaire)
        }, 0)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const token = localStorage.getItem('token')

        try {
            const response = await fetch('/api/invoices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    client_id: clientId,
                    title,
                    date_of_issue: dateOfIssue,
                    due_date: dueDate,
                    items,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                downloadPdf(data.invoice.id)
                navigate('/dashboard/invoice')
            } else {
                setError(data.message || 'Erreur création facture')
            }
        } catch (err) {
            setError('Une erreur est survenue.')
        } finally {
            setLoading(false)
        }
    }

    const downloadPdf = async (invoiceId) => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`/api/invoices/${invoiceId}/pdf`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `facture-${invoiceId}.pdf`
            a.click()
        } catch (err) {
            console.error('Erreur téléchargement PDF:', err)
        }
    }

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <h1 className="text-2xl font-bold text-white text-center mb-8">Créer une facture</h1>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <select
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value)}
                            required
                            className="w-full bg-transparent border-b border-gray-600 px-2 py-3 text-white focus:outline-none focus:border-white transition-colors"
                        >
                            <option value="" className="bg-dark">Sélectionner un client *</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id} className="bg-dark">
                                    {client.nom}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full bg-transparent border-b border-gray-600 px-2 py-3 text-white focus:outline-none focus:border-white transition-colors"
                            placeholder="Titre *"
                        />
                    </div>

                    <div className="flex gap-4">
                        <input
                            type="date"
                            value={dateOfIssue}
                            onChange={(e) => setDateOfIssue(e.target.value)}
                            required
                            className="w-1/2 bg-transparent border-b border-gray-600 px-2 py-3 text-white focus:outline-none focus:border-white transition-colors"
                        />
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                            className="w-1/2 bg-transparent border-b border-gray-600 px-2 py-3 text-white focus:outline-none focus:border-white transition-colors"
                        />
                    </div>

                    <div className="pt-4">
                        <p className="text-gray-400 text-sm mb-2">Articles</p>
                        {items.map((item, index) => (
                            <div key={index} className="bg-dark-soft rounded-lg p-4 mb-3">
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={item.nom}
                                        onChange={(e) => updateItem(index, 'nom', e.target.value)}
                                        required
                                        className="w-full bg-transparent border-b border-gray-600 px-2 py-2 text-white focus:outline-none focus:border-white transition-colors text-sm"
                                        placeholder="Nom de l'article *"
                                    />
                                    <input
                                        type="text"
                                        value={item.description}
                                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                                        className="w-full bg-transparent border-b border-gray-600 px-2 py-2 text-white focus:outline-none focus:border-white transition-colors text-sm"
                                        placeholder="Description"
                                    />
                                    <div className="flex gap-4">
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantite}
                                            onChange={(e) => updateItem(index, 'quantite', parseInt(e.target.value) || 1)}
                                            required
                                            className="w-1/3 bg-transparent border-b border-gray-600 px-2 py-2 text-white focus:outline-none focus:border-white transition-colors text-sm"
                                            placeholder="Qté"
                                        />
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={item.prix_unitaire}
                                            onChange={(e) => updateItem(index, 'prix_unitaire', parseFloat(e.target.value) || 0)}
                                            required
                                            className="w-2/3 bg-transparent border-b border-gray-600 px-2 py-2 text-white focus:outline-none focus:border-white transition-colors text-sm"
                                            placeholder="Prix unitaire (€)"
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300 text-sm">
                                            Sous-total: {(item.quantite * item.prix_unitaire).toFixed(2)} €
                                        </span>
                                        {items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="text-red-400 hover:text-red-300 text-sm transition-colors"
                                            >
                                                Supprimer
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addItem}
                            className="w-full border border-dashed border-gray-600 text-gray-400 py-2 rounded-lg hover:border-white hover:text-white transition-colors text-sm"
                        >
                            + Ajouter un article
                        </button>
                    </div>

                    <div className="text-center py-4">
                        <p className="text-white text-xl font-semibold">
                            Total: {calculateTotal().toFixed(2)} €
                        </p>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-dark font-medium py-3 px-6 rounded-full hover:bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Création...' : 'Créer la facture'}
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/invoice')}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default GenerateInvoice
