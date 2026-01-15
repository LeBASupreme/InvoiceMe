import React from 'react'
import { useState } from 'react'
function AddClient() {
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [adresse, setAdresse] = useState('');
    const [codePostal, setCodePostal] = useState('');
    const [ville, setVille] = useState('');
    const [pays, setPays] = useState('');
    const [siret, setSiret] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
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
            });
            const data = await response.json();
            console.log('Response:', data);
            if (response.ok) {
                console.log('Client added successfully:', data);
            } else {
                setError(data.message || 'Adding client failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
            <div>
                <h1>Ajouter un client</h1>

                {error && <div style={{ color: 'red' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nom </label>
                        <input
                            type="text"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Téléphone</label>
                        <input
                            type="text"
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Adresse</label>
                        <input
                            type="text"
                            value={adresse}
                            onChange={(e) => setAdresse(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Code postal</label>
                        <input
                            type="text"
                            value={codePostal}
                            onChange={(e) => setCodePostal(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Ville</label>
                        <input
                            type="text"
                            value={ville}
                            onChange={(e) => setVille(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Pays</label>
                        <input
                            type="text"
                            value={pays}
                            onChange={(e) => setPays(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>SIRET</label>
                        <input
                            type="text"
                            value={siret}
                            onChange={(e) => setSiret(e.target.value)}
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Création...' : 'Créer le client'}
                    </button>
                </form>
            </div>
    );
}

export default AddClient