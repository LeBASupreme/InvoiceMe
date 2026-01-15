import { useState } from 'react'

function ClientInfo({ client }) {
    const [logo, setLogo] = useState(null)

    const handleLogoChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setLogo(URL.createObjectURL(file))
        }
    }

    const handleDeleteLogo = () => {
        setLogo(null)
    }

    return (
        <div className="bg-dark-soft p-6 rounded-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 border-2 border-white flex items-center justify-center bg-white">
                        {logo ? (
                            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-500 text-sm font-medium">LOGO</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <h3 className="font-semibold text-white text-lg">
                            {client?.nom || 'Nom du client'}
                        </h3>
                        <p className="text-gray-300 text-sm">
                            {client?.adresse ? `${client.adresse}, ${client.code_postal || ''} ${client.ville || ''}` : 'Adresse non renseignée'}
                        </p>
                        <p className="text-gray-300 text-sm">
                            {client?.email || 'Email non renseigné'}
                        </p>
                        <p className="text-gray-300 text-sm">
                            SIRET: {client?.siret || 'Non renseigné'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <label className="cursor-pointer text-gray-300 hover:text-white transition-colors">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                        />
                        <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Modifier
                        </span>
                    </label>

                    {logo && (
                        <button
                            onClick={handleDeleteLogo}
                            className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Supprimer
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ClientInfo
