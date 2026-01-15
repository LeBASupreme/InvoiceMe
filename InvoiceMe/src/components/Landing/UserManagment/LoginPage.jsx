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
                localStorage.setItem('token', data.token);
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
        <div className="flex flex-col items-center justify-center min-h-screen text-white">
            <form onSubmit={handleSubmit} className="">
                <h1 className="text-4xl font-bold mb-6">Connexion</h1>

                <div className="mb-4">
                    <label className="block mb-2">Email</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 rounded text-white border border-gray-300"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Mot de passe</label>
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 rounded text-white border border-gray-300"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full p-2 rounded "
                >
                    Se connecter
                </button>
            </form>
        </div>
    );
}

export default LoginPage