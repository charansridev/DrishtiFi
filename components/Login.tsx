import React, { useState } from 'react';
import { UserIcon, LockIcon } from './IconComponents';
import { getUsers, saveUsers } from '../services/userService';

interface LoginProps {
  onLoginSuccess: (username: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  // State for Login
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // State for SignUp
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');

  // User store is now managed by the userService, which uses localStorage.
  const [users, setUsers] = useState(() => getUsers());

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (users[loginUsername] && users[loginUsername] === loginPassword) {
      setLoginError('');
      onLoginSuccess(loginUsername);
    } else {
      setLoginError('Invalid username or password.');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess('');

    if (signupPassword !== confirmPassword) {
      setSignupError('Passwords do not match.');
      return;
    }
    if(signupUsername.trim().length < 3) {
      setSignupError('Username must be at least 3 characters.');
      return;
    }
    if (users[signupUsername]) {
      setSignupError('Username already exists.');
      return;
    }
    
    // Create the new user and save to persistent storage
    const newUsers = { ...users, [signupUsername]: signupPassword };
    saveUsers(newUsers);
    setUsers(newUsers); // Update component state
    
    setSignupSuccess(`Account for '${signupUsername}' created! Please login.`);

    // Reset signup form and switch to login view
    setLoginUsername(signupUsername); // Pre-fill username for convenience
    setLoginPassword('');
    setSignupUsername('');
    setSignupPassword('');
    setConfirmPassword('');
    setIsLoginView(true);
  };

  const isLoginFormValid = loginUsername.trim() !== '' && loginPassword.trim() !== '';
  const isSignUpFormValid = signupUsername.trim() !== '' && signupPassword.trim() !== '' && confirmPassword.trim() !== '';

  return (
    <div className="w-full max-w-sm bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg animate-fade-in">
      {isLoginView ? (
        <>
          <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-2">Loan Officer Login</h2>
           {signupSuccess && <p className="text-sm text-green-600 dark:text-green-400 text-center mb-4">{signupSuccess}</p>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="login-username" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="login-username"
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="e.g., loan_officer"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md leading-5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                  autoComplete="username"
                />
              </div>
            </div>
            <div>
              <label htmlFor="login-password"className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="e.g., password123"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md leading-5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                  autoComplete="current-password"
                />
              </div>
            </div>
            {loginError && <p className="text-sm text-red-600 dark:text-red-400 text-center">{loginError}</p>}
            <button
              type="submit"
              disabled={!isLoginFormValid}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:disabled:bg-slate-500 transition-colors"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <button onClick={() => { setIsLoginView(false); setLoginError(''); setSignupSuccess(''); }} className="font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300 focus:outline-none">
              Sign Up
            </button>
          </p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-6">Create Account</h2>
          <form onSubmit={handleSignUp} className="space-y-4">
             <div>
              <label htmlFor="signup-username" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="signup-username"
                  type="text"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md leading-5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="signup-password"className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="signup-password"
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Create a password"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md leading-5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                />
              </div>
            </div>
             <div>
              <label htmlFor="confirm-password"className="block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md leading-5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                />
              </div>
            </div>
            {signupError && <p className="text-sm text-red-600 dark:text-red-400 text-center">{signupError}</p>}
            <button
              type="submit"
              disabled={!isSignUpFormValid}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:disabled:bg-slate-500 transition-colors"
            >
              Create Account
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <button onClick={() => { setIsLoginView(true); setSignupError(''); }} className="font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300 focus:outline-none">
              Login
            </button>
          </p>
        </>
      )}
    </div>
  );
};