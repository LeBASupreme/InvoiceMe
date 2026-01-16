import { useState } from 'react'
import { Link } from 'react-router-dom'

function ClientInfo({ client, onDelete }) {
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm(`Supprimer le client "${client.nom}" ?`)) return

        const token = localStorage.getItem('token')
        setDeleting(true)
        try {
            const response = await fetch(`/api/clients/${client.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            })
            if (response.ok) {
                onDelete(client.id)
            }
        } catch (err) {
            console.error('Erreur suppression:', err)
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="bg-dark-soft p-6 rounded-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 border-2 border-white flex items-center justify-center bg-white">
                        <span className="text-gray-500 text-sm font-medium">LOGO</span>
                    </div>

                    <div className="flex flex-col gap-1">
                        <h3 className="font-semibold text-white text-lg">
                            {client.nom || 'Nom du client'}
                        </h3>
                        <p className="text-gray-300 text-sm">
                            {client.adresse ? `${client.adresse}, ${client.code_postal || ''} ${client.ville || ''}` : 'Adresse non renseignée'}
                        </p>
                        <p className="text-gray-300 text-sm">
                            {client.email || 'Email non renseigné'}
                        </p>
                        <p className="text-gray-300 text-sm">
                            SIRET: {client.siret || 'Non renseigné'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        to={`/modifier-client/${client?.id}`}
                        className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Modifier
                    </Link>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {deleting ? 'Suppression...' : 'Supprimer'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ClientInfo
