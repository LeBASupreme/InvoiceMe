import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SignupPage() {
    const [step, setStep] = useState(1)
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [nom, setNom] = useState('')
    const [prenom, setPrenom] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')

    const [organizationName, setOrganizationName] = useState('')
    const [pays, setPays] = useState('')
    const [adresse, setAdresse] = useState('')
    const [codePostal, setCodePostal] = useState('')
    const [ville, setVille] = useState('')
    const [siret, setSiret] = useState('')

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const nextStep = () => setStep(2)
    const prevStep = () => setStep(1)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    nom,
                    prenom,
                    password,
                    password_confirmation: passwordConfirmation,
                    organization_name: organizationName,
                    pays,
                    adresse,
                    code_postal: codePostal,
                    ville,
                    siret
                }),
            })
            const data = await response.json()

            if (response.ok) {
                localStorage.setItem('token', data.token)
                navigate('/dashboard')
            } else {
                setError(data.message || 'Erreur lors de l\'inscription')
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
                <h1 className="text-2xl font-bold text-white text-center mb-2">Inscription</h1>
                <p className="text-gray-400 text-center mb-8">Étape {step} / 2</p>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 text-center">
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={prenom}
                                onChange={(e) => setPrenom(e.target.value)}
                                required
                                className="w-1/2 bg-transparent border-b border-gray-600 px-2 py-3 text-white focus:outline-none focus:border-white transition-colors"
                                placeholder="Prénom *"
                            />
                            <input
                                type="text"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                required
                                className="w-1/2 bg-transparent border-b border-gray-600 px-2 py-3 text-white focus:outline-none focus:border-white transition-colors"
                                placeholder="Nom *"
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-transparent border-b border-gray-600 px-2 py-3 text-white focus:outline-none focus:border-white transition-colors"
                                placeholder="Email *"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-transparent border-b border-gray-600 px-2 py-3 text-white focus:outline-none focus:border-white transition-colors"
                                placeholder="Mot de passe *"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required
                                className="w-full bg-transparent border-b border-gray-600 px-2 py-3 text-white focus:outline-none focus:border-white transition-colors"
                                placeholder="Confirmer mot de passe *"
                            />
                        </div>
                        <div className="pt-6">
                            <button
                                type="button"
                                onClick={nextStep}
                                className="w-full bg-white text-dark font-medium py-3 px-6 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                Suivant
                            </button>
                        </div>
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                Déjà un compte ? Se connecter
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                value={organizationName}
                                onChange={(e) => setOrganizationName(e.target.value)}
                                required
                                className="w-full bg-transparent border-b border-gray-600 px-2 py-3 text-white focus:outline-none focus:border-white transition-colors"
                                placeholder="Nom de l'entreprise *"
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
                                value={siret}
                                onChange={(e) => setSiret(e.target.value)}
                                className="w-full bg-transparent border-b border-gray-600 px-2 py-3 text-white focus:outline-none focus:border-white transition-colors"
                                placeholder="SIRET (optionnel)"
                            />
                        </div>
                        <div className="pt-6 flex gap-4">
                            <button
                                type="button"
                                onClick={prevStep}
                                className="w-1/3 border border-white text-white font-medium py-3 px-6 rounded-full hover:bg-white hover:text-dark transition-colors"
                            >
                                Retour
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-2/3 bg-white text-dark font-medium py-3 px-6 rounded-full hover:bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Inscription...' : "S'inscrire"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default SignupPage