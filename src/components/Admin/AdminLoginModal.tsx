import React, { useState } from 'react';
import { X, Shield, Lock, KeyRound } from 'lucide-react';
import { usePortfolio } from '@/src/context/PortfolioContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { loginAdmin } = usePortfolio();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(pin)) {
      setError(false);
      setPin('');
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-white tracking-tight">
              Admin Access
            </h3>
            <p className="text-[11px] font-mono text-zinc-400 uppercase">
              Restricted Area
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handlePinSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Passcode
            </label>
            <div className="relative">
              <input
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                autoFocus
              />
              <KeyRound className="w-4 h-4 text-zinc-600 absolute right-3.5 top-3" />
            </div>
            {error && (
              <p className="mt-2 text-xs text-red-400 font-mono">
                Incorrect passcode. Access denied.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-amber-400/10"
          >
            <Lock className="w-3.5 h-3.5 text-zinc-950" />
            <span>Authenticate</span>
          </button>
        </form>
      </div>
    </div>
  );
};
