import { useState, useEffect } from 'react';

import ClientInfo from '../GestionClient/other/ClientInfo.jsx';

function GenerateInvoice() {
    const [clientId, setClientId] = useState('');
    const [title, setTitle] = useState('');
    const [dateOfIssue, setDateOfIssue] = useState('');
    const [dueDate, setDueDate] = useState('');
    
    const [items, setItems] = useState([
        { nom: '', description: '', quantite: 1, prix_unitaire: 0 }
    ]);
    
    const [clients, setClients] = useState([]);
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/clients', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                setClients(data.clients);
            }
        } catch (err) {
            console.error('Erreur chargement clients:', err);
        }
    };

    const addItem = () => {
        setItems([...items, { nom: '', description: '', quantite: 1, prix_unitaire: 0 }]);
    };

    const removeItem = (index) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => {
            return sum + (item.quantite * item.prix_unitaire);
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('/api/invoices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    client_id: clientId,
                    title,
                    date_of_issue: dateOfIssue,
                    due_date: dueDate,
                    items,
                }),
            });

            const data = await response.json();
            console.log('Response:', data);

            if (response.ok) {
                console.log('Facture créée:', data);
                downloadPdf(data.invoice.id);
            } else {
                setError(data.message || 'Erreur création facture');
            }
        } catch (err) {
            setError('Une erreur est survenue.');
        } finally {
            setLoading(false);
        }
    };

    const downloadPdf = async (invoiceId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`/api/invoices/${invoiceId}/pdf`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `facture-${invoiceId}.pdf`;
            a.click();
        } catch (err) {
            console.error('Erreur téléchargement PDF:', err);
        }
    };

    return (
        <div>
            <h1>Créer une facture</h1>

            {error && <div style={{ color: 'red' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Client *</label>
                    <select 
                        value={clientId} 
                        onChange={(e) => setClientId(e.target.value)}
                        required
                    >
                        <option value="">Sélectionner un client</option>
                        {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                                {client.nom}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Titre *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Date d'émission *</label>
                    <input
                        type="date"
                        value={dateOfIssue}
                        onChange={(e) => setDateOfIssue(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Date d'échéance *</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
                </div>


                <h3>Articles</h3>
                {items.map((item, index) => (
                    <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                        <div>
                            <label>Nom *</label>
                            <input
                                type="text"
                                value={item.nom}
                                onChange={(e) => updateItem(index, 'nom', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Description</label>
                            <input
                                type="text"
                                value={item.description}
                                onChange={(e) => updateItem(index, 'description', e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Quantité *</label>
                            <input
                                type="number"
                                min="1"
                                value={item.quantite}
                                onChange={(e) => updateItem(index, 'quantite', parseInt(e.target.value))}
                                required
                            />
                        </div>
                        <div>
                            <label>Prix unitaire (€) *</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.prix_unitaire}
                                onChange={(e) => updateItem(index, 'prix_unitaire', parseFloat(e.target.value))}
                                required
                            />
                        </div>
                        <div>
                            <strong>Sous-total: {(item.quantite * item.prix_unitaire).toFixed(2)} €</strong>
                        </div>
                        {items.length > 1 && (
                            <button type="button" onClick={() => removeItem(index)}>
                                Supprimer
                            </button>
                        )}
                    </div>
                ))}

                <button type="button" onClick={addItem}>
                    + Ajouter un article
                </button>

                <div>
                    <h3>Total: {calculateTotal().toFixed(2)} €</h3>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Création...' : 'Créer la facture'}
                </button>
            </form>

            
        </div>
    );
}

export default GenerateInvoice;

