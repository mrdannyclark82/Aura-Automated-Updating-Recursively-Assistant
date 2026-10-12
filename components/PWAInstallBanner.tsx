import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, X, Share2, Smartphone, Check, Sparkles } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Suppress if already installed or dismissed by user in this session
  if (isInstalled || dismissed) {
    return null;
  }

  // If neither installable nor iOS Safari, do not render
  if (!isInstallable && !isIOS) {
    return null;
  }

  return (
    <>
      {/* Ambient bottom install banner */}
      <div className="fixed bottom-4 right-4 z-40 max-w-sm w-[calc(100%-2rem)] bg-[#0d1338]/95 border border-cyan-400/40 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl animate-fade-in text-white flex items-center justify-between gap-3 shadow-cyan-950/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 flex-shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Install Aura Assistant</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                PWA
              </span>
            </div>
            <p className="text-[11px] text-white/60 leading-tight mt-0.5">
              Offline WebGPU Gemma & instant desktop launch.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isInstallable && (
            <button
              onClick={install}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs flex items-center gap-1 shadow-md shadow-cyan-900/40 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
          )}

          {isIOS && !isInstallable && (
            <button
              onClick={() => setShowIOSModal(true)}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 font-medium text-xs flex items-center gap-1 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Install iOS</span>
            </button>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Guided iOS Safari Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#0c102d] border border-white/20 p-5 shadow-2xl text-white space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold flex items-center gap-2 text-cyan-300">
                <Smartphone className="w-4 h-4" />
                Install on iPhone or iPad
              </h3>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-white/80">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Tap the <strong>Share</strong> button <Share2 className="inline w-3 h-3 text-cyan-400 mx-1" /> in the Safari bottom toolbar.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Scroll down and tap <strong>Add to Home Screen</strong>.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Open <strong>Aura</strong> directly from your Home Screen with standalone full-screen presence.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAInstallBanner;
