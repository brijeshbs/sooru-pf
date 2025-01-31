import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

// Create axios instance with default config
const api = axios.create({
    baseURL: 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

const Auth = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [resetEmail, setResetEmail] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/users/login', loginData);
            localStorage.setItem('token', response.data.token);
            navigate('/projects');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (registerData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (registerData.password !== registerData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            console.log('Attempting registration with:', registerData);
            const response = await api.post('/users/register', {
                name: registerData.name,
                email: registerData.email,
                password: registerData.password
            });

            console.log('Registration successful:', response.data);
            localStorage.setItem('token', response.data.token);
            setSuccessMessage('Registration successful!');
            
            setTimeout(() => {
                navigate('/projects');
            }, 1500);
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/users/forgot-password', { email: resetEmail });
            setSuccessMessage(response.data.message || 'Password reset instructions sent to your email');
            
            setTimeout(() => {
                setActiveTab('login');
                setSuccessMessage('');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="auth-tabs">
                    <button 
                        className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => setActiveTab('login')}
                    >
                        Login
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
                        onClick={() => setActiveTab('register')}
                    >
                        Register
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'forgot' ? 'active' : ''}`}
                        onClick={() => setActiveTab('forgot')}
                    >
                        Forgot Password
                    </button>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="success-message">
                        {successMessage}
                    </div>
                )}

                <div className="auth-content">
                    {activeTab === 'login' && (
                        <form onSubmit={handleLogin} className="auth-form">
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                                    placeholder="Enter your email"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                    placeholder="Enter your password"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    )}

                    {activeTab === 'register' && (
                        <form onSubmit={handleRegister} className="auth-form">
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={registerData.name}
                                    onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                                    placeholder="Enter your name"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={registerData.email}
                                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                                    placeholder="Enter your email"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={registerData.password}
                                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                                    placeholder="Choose a password"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    value={registerData.confirmPassword}
                                    onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                                    placeholder="Confirm your password"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={loading}
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                        </form>
                    )}

                    {activeTab === 'forgot' && (
                        <form onSubmit={handleForgotPassword} className="auth-form">
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;