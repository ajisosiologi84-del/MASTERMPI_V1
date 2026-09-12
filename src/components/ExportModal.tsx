import React, { useState } from 'react';
import { generateStandaloneMpiHtml } from '../utils/standaloneHtmlGenerator';
import { sound } from '../utils/audio';
import { MpiConfig, MateriItem, GameItem, SoalLatih } from '../types';
import { SigmaLogo } from './SigmaLogo';
import { X, Copy, Check, Download, FileCode, CheckCircle2 } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config?: MpiConfig;
  materi?: MateriItem[];
  bermain?: GameItem[];
  latih?: SoalLatih[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  config,
  materi,
  bermain,
  latih
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const htmlContent = generateStandaloneMpiHtml(config, materi, bermain, latih);

  const handleCopyCode = async () => {
    sound.playSuccess();
    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback if clipboard API is restricted
      const textarea = document.createElement('textarea');
      textarea.value = htmlContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownloadFile = () => {
    sound.playSuccess();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedName = (config?.judul || 'mpi_offline').toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.setAttribute('download', `${sanitizedName}_offline.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <SigmaLogo 
              size="sm"
              showText={false}
              animated={true}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white leading-tight">
                  Ekspor Single-File HTML Offline (MASTERMPI)
                </h3>
                <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-cyan-400/30">
                  100% Offline
                </span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30 hidden sm:inline-block">
                  @ajisosiologi 2026
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Smart MPI &amp; Gamification Engine • Mandiri Tanpa Server • Bebas Kuota
              </p>
            </div>
          </div>

          <button
            id="close-export-modal-btn"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3 text-xs sm:text-sm text-emerald-900">
            <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">File HTML ini siap dijalankan offline!</span> Seluruh konfigurasi JavaScript (<code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">CONFIG</code>, <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">MATERI</code>, <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">dataBermain</code>, dan <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">dtLatih</code>) telah terinjeksi sempurna dengan sintaks valid. Anda dapat mengunduh atau menyalin kodenya di bawah ini.
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              id="download-html-file-btn"
              onClick={handleDownloadFile}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm transition shadow-xs border border-amber-400"
            >
              <Download size={16} />
              <span>Unduh File .html (Offline)</span>
            </button>

            <button
              id="copy-html-code-btn"
              onClick={handleCopyCode}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shadow-xs border ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-800'
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Kode HTML Utuh'}</span>
            </button>
          </div>

          {/* Code Viewer Preview */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 flex items-center justify-between font-mono">
              <span>mpi_offline_sosiologi.html</span>
              <span>{htmlContent.length.toLocaleString()} karakter</span>
            </div>
            <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto max-h-72 leading-relaxed selection:bg-emerald-900 selection:text-white">
              {htmlContent}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
