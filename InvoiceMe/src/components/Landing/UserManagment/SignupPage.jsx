import React from 'react'
import { useEffect, useState } from 'react'


function SignupPage() {
    const [step, setStep] = useState(1);

    const [email, setEmail] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');


    const [organizationName, setOrganizationName] = useState('');
    const [pays, setPays] = useState('');
    const [adresse, setAdresse] = useState('');
    const [codePostal, setCodePostal] = useState('');
    const [ville, setVille] = useState('');
    const [siret, setSiret] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const nextStep = () => setStep(2);
    const prevStep = () => setStep(1);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
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
        });
            const data = await response.json();
            console.log('Response:', data);
            if (response.ok) {
                console.log('Signup successful:', data);
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="">
            <div className="">
                <h1 className="">Inscription</h1>
                <p className="">Étape {step} / 2</p>

                {error && (
                    <div className="">{error}</div>
                )}

                {step === 1 && (
                    <div>
                        <div className="">
                            <label className="">Prénom</label>
                            <input
                                type="text"
                                value={prenom}
                                onChange={(e) => setPrenom(e.target.value)}
                                className=""
                            />
                        </div>
                        <div className="">
                            <label className="">Nom</label>
                            <input
                                type="text"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                className=""
                            />
                        </div>
                        <div className="">
                            <label className="">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className=""
                            />
                        </div>
                        <div className="">
                            <label className="">Mot de passe</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className=""
                            />
                        </div>
                        <div className="">
                            <label className="">Confirmer mot de passe</label>
                            <input
                                type="password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                className=""
                            />
                        </div>
                        <button
                            type="button"
                            onClick={nextStep}
                            className=""
                        >
                            Suivant
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <form onSubmit={handleSubmit}>
                        <div className="">
                            <label className="">Nom de l'entreprise</label>
                            <input
                                type="text"
                                value={organizationName}
                                onChange={(e) => setOrganizationName(e.target.value)}
                                className=""
                            />
                        </div>
                        <div className="">
                            <label className="">Pays</label>
                            <input
                                type="text"
                                value={pays}
                                onChange={(e) => setPays(e.target.value)}
                                className=""
                            />
                        </div>
                        <div className="">
                            <label className="">Adresse</label>
                            <input
                                type="text"
                                value={adresse}
                                onChange={(e) => setAdresse(e.target.value)}
                                className=""
                            />
                        </div>
                        <div className="">
                            <div className="">
                                <label className="">Code postal</label>
                                <input
                                    type="text"
                                    value={codePostal}
                                    onChange={(e) => setCodePostal(e.target.value)}
                                    className=""
                                />
                            </div>
                            <div className="">
                                <label className="">Ville</label>
                                <input
                                    type="text"
                                    value={ville}
                                    onChange={(e) => setVille(e.target.value)}
                                    className=""
                                />
                            </div>
                        </div>
                        <div className="">
                            <label className="">SIRET (optionnel)</label>
                            <input
                                type="text"
                                value={siret}
                                onChange={(e) => setSiret(e.target.value)}
                                className=""
                            />
                        </div>
                        <div className="">
                            <button
                                type="button"
                                onClick={prevStep}
                                className=""
                            >
                                Retour
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className=""
                            >
                                {loading ? 'Inscription...' : "S'inscrire"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default SignupPage