
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../zustandStores/authStore.js';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { login, loading, error } = useAuthStore();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const success = await login({ email, password });
		if (success) {
			navigate('/');
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
			<form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6 text-purple-700 text-center">Login</h2>
				<div className="mb-4">
					<label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
					<input
						type="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
						required
					/>
				</div>
				<div className="mb-6">
					<label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
					<input
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
						required
					/>
				</div>
				{error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
				<button
					type="submit"
					className="w-full bg-purple-600 text-white py-2 rounded-md font-semibold hover:bg-purple-700 transition-colors"
					disabled={loading}
				>
					{loading ? 'Logging in...' : 'Login'}
				</button>
				<div className="mt-6 text-center">
					<span className="text-sm text-gray-600">Don't have an account? </span>
					<a href="/signup" className="text-purple-700 font-semibold hover:underline">Sign up</a>
				</div>
			</form>
		</div>
	);
};

export default Login;
