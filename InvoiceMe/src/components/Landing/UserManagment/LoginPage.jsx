import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })
            const data = await response.json()

            if (response.ok) {
                localStorage.setItem('token', data.token)
                navigate('/dashboard')
            } else {
                setError(data.message || 'Identifiants incorrects')
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
                <h1 className="text-2xl font-bold text-white text-center mb-8">Connexion</h1>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-transparent border-b border-gray-600 px-2 py-3 text-white focus:outline-none focus:border-white transition-colors"
                            placeholder="Email"
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-transparent border-b border-gray-600 px-2 py-3 text-white focus:outline-none focus:border-white transition-colors"
                            placeholder="Mot de passe"
                        />
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-dark font-medium py-3 px-6 rounded-full hover:bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            Créer un compte
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginPage