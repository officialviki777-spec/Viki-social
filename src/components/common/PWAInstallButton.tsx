import React, { useState } from 'react';
import { Download, CheckCircle, Share, PlusSquare, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'button' | 'card' | 'compact' | 'header';
  onInstalled?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'button',
  onInstalled,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [installing, setInstalling] = useState(false);

  if (isInstalled) {
    if (variant === 'card') {
      return (
        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold block text-white text-xs">VIKI SOCIAL App Active</span>
              <span className="text-[10px] text-zinc-400">Installed in full standalone mode</span>
            </div>
          </div>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-400 text-black">
            Installed
          </span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      setInstalling(true);
      const accepted = await install();
      setInstalling(false);
      if (accepted && onInstalled) {
        onInstalled();
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {variant === 'header' && (
        <button
          onClick={handleInstallClick}
          title="Direct Install VIKI SOCIAL App"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-black text-xs font-black transition-all shadow-md active:scale-95 hover:opacity-90"
          aria-label="Direct Download & Install App"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Get App</span>
        </button>
      )}

      {variant === 'compact' && (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-black text-xs font-black shadow-md shadow-cyan-500/30 hover:opacity-95 active:scale-95 transition"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Download App</span>
        </button>
      )}

      {variant === 'card' && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#0066FF]/20 via-zinc-900 to-[#00F0FF]/10 border border-cyan-500/30 space-y-2.5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0066FF] to-[#00F0FF] p-[2px] flex items-center justify-center shadow-lg shadow-[#0066FF]/30">
                <div className="w-full h-full bg-[#08080C] rounded-[10px] flex items-center justify-center">
                  <span className="text-cyan-400 font-black text-sm">
                    V
                  </span>
                </div>
              </div>
              <div>
                <span className="font-extrabold block text-white text-xs">Direct Install VIKI SOCIAL App</span>
                <span className="text-[11px] text-zinc-400">
                  Installs directly to your phone's home screen & app drawer.
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            disabled={installing}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#0066FF] via-[#0A84FF] to-[#00F0FF] text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 transition-all active:scale-[0.98]"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{installing ? 'Installing...' : 'Direct Download / Install on Phone'}</span>
          </button>
        </div>
      )}

      {variant === 'button' && (
        <button
          onClick={handleInstallClick}
          disabled={installing}
          className="w-full p-3 rounded-2xl bg-gradient-to-r from-[#0066FF]/20 to-[#00F0FF]/20 border border-cyan-500/40 text-cyan-300 hover:text-white flex items-center justify-between transition-colors font-bold text-xs"
        >
          <div className="flex items-center gap-2.5">
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Direct Install VIKI SOCIAL App</span>
          </div>
          <span className="text-[10px] bg-cyan-400 text-black px-2 py-0.5 rounded-full font-black">
            1-Click Install
          </span>
        </button>
      )}

      {/* Direct Install Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#08080C] border border-cyan-500/40 p-5 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0066FF] to-[#00F0FF] p-[2px]">
                  <div className="w-full h-full bg-[#08080C] rounded-[10px] flex items-center justify-center">
                    <span className="text-cyan-400 font-black text-xs">V</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">Download VIKI SOCIAL</h3>
                  <span className="text-[10px] text-zinc-400">Direct Android Install</span>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              VIKI SOCIAL को अपने Android फ़ोन में डायरेक्ट ऐप की तरह इंस्टॉल करने के लिए:
            </p>

            <div className="space-y-3 p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 mt-0.5">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-white">1. Chrome का मेनू खोलें</strong>
                  <span className="text-zinc-400 text-[11px]">
                    ऊपर दाएँ कोने में <strong>तीन डॉट्स (⋮)</strong> पर टैप करें।
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 mt-0.5">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-white">2. "Install app" या "Add to Home screen" चुनें</strong>
                  <span className="text-zinc-400 text-[11px]">
                    <strong>"Install App"</strong> (ऐप इंस्टॉल करें) पर टैप करें।
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-emerald-400 font-semibold text-center">
              ✓ ऐप तुरंत आपके फ़ोन के होम स्क्रीन और ऐप ड्रॉअर में आ जाएगी!
            </p>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-black font-black text-xs shadow-lg shadow-cyan-500/30"
            >
              समझ गया / Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
