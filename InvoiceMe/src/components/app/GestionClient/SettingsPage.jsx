import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function SettingsPage() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        newPassword_confirmation: '',
    })

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('/api/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            })

            if (response.ok) {
                const data = await response.json()
                setUser(data.user)
                setFormData(prev => ({
                    ...prev,
                    nom: data.user.nom || '',
                    prenom: data.user.prenom || '',
                    email: data.user.email || '',
                }))
            } else if (response.status === 401) {
                navigate('/login')
            }
        } catch (err) {
            console.error('Erreur:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setMessage({ type: '', text: '' })

        try {
            const token = localStorage.getItem('token')
            const response = await fetch('/api/user/update', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                setMessage({ type: 'success', text: 'Profil mis à jour avec succès' })
                setUser(data.user)
                setFormData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    newPassword_confirmation: '',
                }))
            } else {
                setMessage({ type: 'error', text: data.message || 'Erreur lors de la mise à jour' })
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Une erreur est survenue' })
        } finally {
            setSaving(false)
        }
    }

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token')
            await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            })
        } catch (err) {
            console.error('Erreur logout:', err)
        } finally {
            localStorage.removeItem('token')
            navigate('/login')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-dark flex items-center justify-center">
                <div className="text-white">Chargement...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-dark p-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Paramètres</h1>

                {message.text && (
                    <div className={`px-4 py-3 rounded-lg mb-6 ${
                        message.type === 'success'
                            ? 'bg-green-500/20 border border-green-500 text-green-400'
                            : 'bg-red-500/20 border border-red-500 text-red-400'
                    }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Informations personnelles */}
                    <div className="bg-dark-light rounded-xl p-6 border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-6">Informations personnelles</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Prénom</label>
                                <input
                                    type="text"
                                    name="prenom"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                    className="w-full bg-dark border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Nom</label>
                                <input
                                    type="text"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    className="w-full bg-dark border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-gray-400 text-sm mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-dark border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                            />
                        </div>
                    </div>

                    {/* Changer le mot de passe */}
                    <div className="bg-dark-light rounded-xl p-6 border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-6">Changer le mot de passe</h2>
                        <p className="text-gray-400 text-sm mb-4">Laissez vide si vous ne souhaitez pas changer votre mot de passe</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Mot de passe actuel</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    className="w-full bg-dark border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="w-full bg-dark border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Confirmer le nouveau mot de passe</label>
                                <input
                                    type="password"
                                    name="newPassword_confirmation"
                                    value={formData.newPassword_confirmation}
                                    onChange={handleChange}
                                    className="w-full bg-dark border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bouton sauvegarder */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-8 py-3 bg-white text-dark font-semibold rounded-lg hover:bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </button>
                    </div>
                </form>

                {/* Section déconnexion */}
                <div className="mt-8 bg-dark-light rounded-xl p-6 border border-red-500/30">
                    <h2 className="text-xl font-semibold text-white mb-4">Zone de danger</h2>
                    <p className="text-gray-400 mb-4">Déconnectez-vous de votre compte</p>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-3 bg-red-500/20 text-red-400 border border-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                    >
                        Se déconnecter
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage