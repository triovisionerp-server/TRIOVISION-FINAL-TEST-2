'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';

const COMPANY_DOMAIN = '@triovisioninternational.com';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailLocal, setEmailLocal] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const fullEmail = emailLocal.includes('@') 
    ? emailLocal 
    : emailLocal + COMPANY_DOMAIN;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/@/g, '');
    if (value.includes('triovisioninternational.com')) {
      value = value.replace('triovisioninternational.com', '');
    }
    setEmailLocal(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Sign in with Firebase Auth ONLY
      await signInWithEmailAndPassword(auth, fullEmail, password);
      
      // Direct redirect based on username (NO FIRESTORE CHECK)
      if (emailLocal === 'admin') {
        router.push('/admin');
      } else if (emailLocal === 'supervisor') {
        router.push('/supervisor');
      } else {
        router.push('/admin'); // Default
      }
      
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/user-not-found') {
        setError('User not found');
      } else {
        setError('Login failed. Please try again.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h1 className="text-3xl sm:text-4xl font-light text-white mb-2 tracking-tight">
                  Welcome Back
                </h1>
                <p className="text-zinc-400 text-sm font-light">
                  Sign in to Composite ERP
                </p>
              </motion.div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-500 transition-colors group-focus-within:text-blue-400" />
                  <Input
                    type="text"
                    value={emailLocal}
                    onChange={handleEmailChange}
                    placeholder="username"
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-48 h-12 bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 rounded-xl focus:bg-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 outline-none"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-500 text-sm pointer-events-none">
                    {COMPANY_DOMAIN}
                  </span>
                </div>
                <AnimatePresence>
                  {emailLocal && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-zinc-500 mt-2"
                    >
                      Logging in as <span className="text-blue-400 font-medium">{fullEmail}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-500 transition-colors group-focus-within:text-blue-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-12 h-12 bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 rounded-xl focus:bg-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading || !emailLocal || !password}
                  className="w-full h-12 bg-white text-zinc-900 hover:bg-zinc-100 font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/10"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-zinc-500">
                Need access?{' '}
                <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Contact Admin
                </button>
              </p>
            </motion.div>
          </div>

          {/* Demo Accounts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="px-8 pb-8"
          >
            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
              <p className="text-xs font-semibold text-blue-400 mb-2">
                Demo Accounts
              </p>
              <div className="space-y-1 text-xs text-zinc-400">
                <p>Admin: <span className="text-zinc-300">admin / admin123</span></p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-zinc-600 text-sm"
        >
          <p>© 2025 Composite ERP System</p>
          <p className="text-xs mt-1">Powered by TrioVision International</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
