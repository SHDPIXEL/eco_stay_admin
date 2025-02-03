import React, { useState, useEffect } from 'react';
import { Lock, Mail, EyeClosed, EyeIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import API from '../lib/utils';
import { Helmet } from 'react-helmet-async';

const TOKEN_EXPIRY_DURATION = 60 * 60 * 1000;

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (token && tokenExpiry) {
      const isExpired = Date.now() > parseInt(tokenExpiry, 10);
      if (isExpired) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenExpiry');
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
        navigate('/dashboard');
      }
    }
  }, [navigate, setIsAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/api/auth/login', {
        user_id_ent: email,
        password_ent: password,
      });
      console.log(response)

      if (response.status === 200) {
        setIsAuthenticated(true);
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem(
          'tokenExpiry',
          (Date.now() + TOKEN_EXPIRY_DURATION).toString()
        );
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Failed to login. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 poppins-regular">
      <Helmet>
        <title>Eco Stay | Admin Login</title>
        <meta name="Admin Login" content="Eco Stay Admin Login!" />
      </Helmet>
      <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 pb-0">
          <h2 className="text-2xl font-bold text-center text-gray-900">Eco Stay Admin Login</h2>
          <p className="mt-2 text-center text-gray-600">
            Enter your credentials to access the admin dashboard
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder="admin@company.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className='cursor-pointer' onClick={handleTogglePassword} >
                {
                  showPassword ? (<EyeClosed className='absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-500' />
                  ) : (
                    <EyeIcon className='absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-500' />
                  )
                } 
              </div>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-black hover:bg-gray-900 text-white font-medium rounded-md"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
