function FactureInfo({ facture }) {

    const handleDownload = async () => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`/api/invoices/${facture.id}/pdf`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `facture-${facture.id}.pdf`
            a.click()
        } catch (err) {
            console.error('Erreur téléchargement PDF:', err)
        }
    }

    return (
        <div className="bg-dark-soft p-6 rounded-lg">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-white text-lg">
                        {facture.title || 'Titre de la facture'}
                    </h3>
                    <p className="text-gray-300 text-sm">
                        {facture.client.nom || 'Client non renseigné'}
                    </p>
                    <p className="text-gray-300 text-sm">
                        Date: {facture.date_of_issue || 'Non renseignée'}
                    </p>
                    <p className="text-gray-300 text-sm">
                        Total: {facture.total_amount ? `${parseFloat(facture.total_amount).toFixed(2)} €` : '0.00 €'}
                    </p>
                </div>

                <button
                    onClick={handleDownload}
                    className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Télécharger
                </button>
            </div>
        </div>
    )
}

export default FactureInfo
