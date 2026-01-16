import { useNavigate } from 'react-router-dom'

function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-8xl font-bold text-white mb-4">404</h1>
                <h2 className="text-2xl text-gray-300 mb-4">Page non trouvée</h2>
                <p className="text-gray-500 mb-8">
                    La page que vous recherchez n'existe pas ou a été déplacée.
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="border border-gray-600 text-white font-medium py-3 px-8 rounded-full hover:border-white transition-colors"
                    >
                        Retour
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-white text-dark font-medium py-3 px-8 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        Accueil
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NotFound
