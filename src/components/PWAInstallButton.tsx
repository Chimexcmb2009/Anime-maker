import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { Download, Share, PlusSquare, X, Smartphone, CheckCircle2 } from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running as an installed PWA on the home screen
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline">Installed App</span>
        <span className="sm:hidden">App Ready</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 3000);
    }
  };

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <>
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 active:scale-95 transition-all cursor-pointer ${
            compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
          }`}
          title="Install app to your home screen"
        >
          <Download className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>{compact ? 'Install PWA' : 'Install App on Phone'}</span>
        </button>

        {installSuccess && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl text-sm font-medium animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            Installed successfully to Home Screen!
          </div>
        )}
      </>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-medium hover:bg-emerald-500/20 active:scale-95 transition-all cursor-pointer ${
            compact ? 'px-3 py-1.5 text-xs' : 'px-3.5 py-2 text-xs sm:text-sm'
          }`}
        >
          <Smartphone className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-amber-500 flex items-center justify-center font-bold text-slate-950 text-base">
                    NS
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Install NaijaSkits</h3>
                    <p className="text-xs text-slate-400">Add to iPhone / iPad Home Screen</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 my-5 text-sm text-slate-300">
                <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-2xl">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
                    <Share className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Step 1</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tap the <strong className="text-blue-300">Share</strong> icon at the bottom of Safari toolbar.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-2xl">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                    <PlusSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Step 2</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Scroll down and tap <strong className="text-emerald-300">Add to Home Screen</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback desktop / browser banner button (shows manual Add to Home Screen tip)
  return (
    <button
      onClick={() => setShowIOSGuide(true)}
      className={`flex items-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-800/50 text-slate-300 font-medium hover:bg-slate-800 hover:text-white transition-all cursor-pointer ${
        compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs'
      }`}
      title="Mobile App Options"
    >
      <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
      <span>Mobile App</span>

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Install on Mobile</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowIOSGuide(false);
                }}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Open this URL on your mobile phone browser (Chrome, Safari, or Edge) and tap <strong>Install App</strong> or <strong>Add to Home Screen</strong> from the browser menu to use full-screen offline!
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowIOSGuide(false);
              }}
              className="mt-4 w-full py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </button>
  );
};
