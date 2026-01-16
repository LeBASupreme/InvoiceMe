import { useNavigate } from 'react-router-dom'

function Unauthorized() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-8xl font-bold text-white mb-4">401</h1>
                <h2 className="text-2xl text-gray-300 mb-4">Non autorisé</h2>
                <p className="text-gray-500 mb-8">
                    Vous devez être connecté pour accéder à cette page.
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-white text-dark font-medium py-3 px-8 rounded-full hover:bg-gray-200 transition-colors"
                >
                    Se connecter
                </button>
            </div>
        </div>
    )
}

export default Unauthorized
