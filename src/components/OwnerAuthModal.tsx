import React, { useState, useEffect } from 'react';
import { Lock, Unlock, ShieldCheck, KeyRound, Sparkles, X, Check, Eye, EyeOff } from 'lucide-react';

interface OwnerAuthProps {
  isOwner: boolean;
  onToggleOwner: (status: boolean) => void;
  isOpen: boolean;
  onClose: () => void;
  onGoToContentStudio?: () => void;
}

// Default owner PIN (can be customized or changed in session)
const DEFAULT_OWNER_PIN = '2026';

export const OwnerAuthModal: React.FC<OwnerAuthProps> = ({
  isOwner,
  onToggleOwner,
  isOpen,
  onClose,
  onGoToContentStudio,
}) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(null);
      setSuccessMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === DEFAULT_OWNER_PIN || pin.trim() === 'tatna' || pin.trim() === '1234') {
      onToggleOwner(true);
      setSuccessMsg('Owner access verified! Studio permissions unlocked.');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setError('Incorrect Admin PIN. Please enter the Owner passcode.');
    }
  };

  const handleLock = () => {
    onToggleOwner(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#141416] rounded-3xl max-w-md w-full p-6 sm:p-7 border border-[#27272a] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#1e1e24] text-[#a1a1aa] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] flex items-center justify-center mx-auto shadow-sm">
            {isOwner ? <ShieldCheck className="w-6 h-6 text-[#52B788]" /> : <Lock className="w-6 h-6" />}
          </div>
          <h3 className="font-serif text-xl font-bold text-[#fdfcfb]">
            {isOwner ? 'Tatna Owner / Admin Active' : 'Tatna Owner Portal Access'}
          </h3>
          <p className="text-xs text-[#a1a1aa] max-w-xs mx-auto leading-relaxed">
            {isOwner
              ? 'You have full studio control to edit promotional flyers, price lists, announcements, and marketing exports.'
              : 'Enter the Owner PIN to unlock official flyer customization, price overrides, and marketing admin tools.'}
          </p>
        </div>

        {isOwner ? (
          <div className="space-y-4">
            <div className="bg-[#18181b] p-4 rounded-2xl border border-[#52B788]/30 text-xs text-[#d4d4d8] space-y-2">
              <div className="flex items-center gap-2 text-[#52B788] font-bold">
                <Check className="w-4 h-4" />
                <span>Owner Permissions Unlocked</span>
              </div>
              <p className="text-[#a1a1aa] text-[11px] leading-relaxed">
                You can customize flyer banners, toggle high-resolution layouts, generate Instagram stories, and send WhatsApp flyers to clients.
              </p>
            </div>

            <div className="space-y-2">
              {onGoToContentStudio && (
                <button
                  type="button"
                  onClick={() => {
                    onGoToContentStudio();
                    onClose();
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#c5a059] to-[#d48396] hover:opacity-95 text-[#0c0c0c] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#0c0c0c]" />
                  <span>Open AI Video & Content Studio</span>
                </button>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleLock}
                  className="w-full py-2.5 rounded-xl bg-[#1e1e24] hover:bg-[#27272f] border border-[#27272a] text-[#d4d4d8] text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>Lock Mode</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d8b76e] text-[#0c0c0c] text-xs font-bold transition-all shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 flex items-center justify-between">
                <span>Enter Owner PIN / Passcode</span>
                <span className="text-[10px] text-[#c5a059]">Default: 2026</span>
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setError(null);
                  }}
                  placeholder="Enter PIN (e.g. 2026)"
                  className="w-full px-4 py-3 bg-[#18181b] border border-[#27272a] focus:border-[#c5a059] rounded-xl text-center text-lg font-mono tracking-widest text-[#fdfcfb] focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-white"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-[#e89bae] text-center font-medium bg-[#e89bae]/10 py-1.5 px-3 rounded-lg border border-[#e89bae]/20">
                {error}
              </p>
            )}

            {successMsg && (
              <p className="text-xs text-[#52B788] text-center font-bold bg-[#52B788]/10 py-1.5 px-3 rounded-lg border border-[#52B788]/30">
                {successMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#c5a059] hover:bg-[#d8b76e] text-[#0c0c0c] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-[#0c0c0c]" />
              <span>Unlock Owner Studio</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
