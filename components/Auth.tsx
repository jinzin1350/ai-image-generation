import React, { useState } from 'react';
import { supabase } from '../supabase';
import SparklesIcon from './icons/SparklesIcon';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
        console.error("Authentication Error:", err.message);
        setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
        <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">
                Fashion AI <span className="text-indigo-600">Photoshoot</span>
            </h1>
            <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
               Welcome! Please sign in or create an account to continue.
            </p>
        </div>
        <div className="w-full max-w-md">
            <form
                onSubmit={handleSubmit}
                className="bg-slate-800 shadow-lg rounded-2xl px-8 pt-6 pb-8 mb-4"
            >
                <h2 className="text-2xl font-bold text-center text-slate-200 mb-6">
                    {isLogin ? 'Sign In' : 'Create Account'}
                </h2>
                <div className="mb-4">
                    <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow-sm appearance-none border border-slate-600 bg-slate-700 rounded-lg w-full py-3 px-4 text-white placeholder-slate-400 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="shadow-sm appearance-none border border-slate-600 bg-slate-700 rounded-lg w-full py-3 px-4 text-white placeholder-slate-400 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        id="password"
                        type="password"
                        placeholder="••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="text-red-500 text-xs italic mb-4 text-center">{error}</p>}

                <div className="flex items-center justify-between">
                    <button
                        className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300"
                        type="submit"
                        disabled={loading}
                    >
                         <SparklesIcon className="w-5 h-5 mr-2 -ml-1" />
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </div>

                <p className="text-center text-slate-400 text-sm mt-6">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                        type="button"
                        onClick={() => { setIsLogin(!isLogin); setError(null); }}
                        className="font-bold text-indigo-500 hover:text-indigo-400 ml-1 focus:outline-none"
                    >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </form>
        </div>
    </div>
  );
};

export default Auth;