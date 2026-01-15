import React from 'react'

import { useEffect, useState } from 'react'
function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
            const data = await response.json();
            console.log('Response:', data);
            if (response.ok) {
                console.log('Login successful:', data);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
        console.log('Je suis connecté !');
        console.log('Email:', email);
        console.log('Password:', password);
    }
  return (
        <div className="">
            <form onSubmit={handleSubmit} className="">
                <h1 className="">Connexion</h1>

                <div className="">
                    <label className="">Email</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className=""
                    />
                </div>

                <div className="">
                    <label className="">Mot de passe</label>
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className=""
                    />
                </div>

                <button
                    type="submit"
                    className=""
                >
                    Se connecter
                </button>
            </form>
        </div>
    );
}

export default LoginPage