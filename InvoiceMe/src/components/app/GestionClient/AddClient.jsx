import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function AddClient() {
    const navigate = useNavigate()
    const [nom, setNom] = useState('')
    const [email, setEmail] = useState('')
    const [telephone, setTelephone] = useState('')
    const [adresse, setAdresse] = useState('')
    const [codePostal, setCodePostal] = useState('')
    const [ville, setVille] = useState('')
    const [pays, setPays] = useState('')
    const [siret, setSiret] = useState('')

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const token = localStorage.getItem('token')

        try {
            const response = await fetch('/api/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nom,
                    email,
                    telephone,
                    adresse,
                    code_postal: codePostal,
                    ville,
                    pays,
                    siret
                }),
            })
            const data = await response.json()
            if (response.ok) {
                navigate('/dashboard/clients')
            } else {
                setError(data.message || 'Erreur lors de la création du client')
            }
        } catch (err) {
            setError('Une erreur est survenue. Veuillez réessayer.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <h1 className="text-2xl font-bold text-white text-center mb-8">Ajouter un client</h1>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            required
                            className="w-full bg-transparent border-b border-gray-600 px-2 py-3 text-white focus:outline-none focus:border-white transition-colors"
                            placeholder="Nom *"
                        />
                    </div>

                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent border-b border-gray-600 px-2 py-3 text-white focus:outline-none focus:border-white transition-colors"
                            placeholder="Email"
                        />
                    </div>

                    <div>
                        <input
                            type="text"
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                            className="w-full bg-transparent border-b border-gray-600 px-2 py-3 text-white focus:outline-none focus:border-white transition-colors"
                            placeholder="Téléphone"
                        />
                    </div>

                    <div>
                        <input
                            type="text"
                            value={adresse}
                            onChange={(e) => setAdresse(e.target.value)}
                            className="w-full bg-transparent border-b border-gray-600 px-2 py-3 text-white focus:outline-none focus:border-white transition-colors"
                            placeholder="Adresse"
                        />
                    </div>

                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={codePostal}
                            onChange={(e) => setCodePostal(e.target.value)}
                            className="w-1/3 bg-transparent border-b border-gray-600 px-2 py-3 text-white focus:outline-none focus:border-white transition-colors"
                            placeholder="Code postal"
                        />
                        <input
                            type="text"
                            value={ville}
                            onChange={(e) => setVille(e.target.value)}
                            className="w-2/3 bg-transparent border-b border-gray-600 px-2 py-3 text-white focus:outline-none focus:border-white transition-colors"
                            placeholder="Ville"
                        />
                    </div>

                    <div>
                        <input
                            type="text"
                            value={pays}
                            onChange={(e) => setPays(e.target.value)}
                            className="w-full bg-transparent border-b border-gray-600 px-2 py-3 text-white focus:outline-none focus:border-white transition-colors"
                            placeholder="Pays"
                        />
                    </div>

                    <div>
                        <input
                            type="text"
                            value={siret}
                            onChange={(e) => setSiret(e.target.value)}
                            className="w-full bg-transparent border-b border-gray-600 px-2 py-3 text-white focus:outline-none focus:border-white transition-colors"
                            placeholder="SIRET"
                        />
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-dark font-medium py-3 px-6 rounded-full hover:bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Création...' : 'Créer le client'}
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/clients')}
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

export default AddClient
